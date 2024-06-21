import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ADMIN_ID } from '../constants/user.constant.js';
import { hash, compareWithHashed, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';
import { sendEmailVerificationCode } from '../utils/email.util.js';
import { redis } from '../utils/redis.util.js';

class AuthService {
  constructor(authRepository, userRepository, transactionLogRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
    this.transactionLogRepository = transactionLogRepository;
  }
  /** 회원가입 */
  signUp = async ({ email, password, nickname, role, contactNumber, address, image }) => {
    // email 중복확인
    const existingEmail = await this.userRepository.getByEmail(email);
    if (existingEmail) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    // nickname 중복확인
    const existingNickname = await this.userRepository.getByNickname(nickname);
    if (existingNickname) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.NICKNAME.DUPLICATED);
    }

    // 비밀번호 암호화
    const hashedPassword = await hash(password);

    // Transaction 생성
    const createdUser = await this.userRepository.createTransaction(async (tx) => {
      // user 생성하기
      const user = await this.userRepository.create(
        {
          email,
          password: hashedPassword,
          nickname,
          role,
          contactNumber,
          address,
          image,
        },
        { tx },
      );

      // transaction log 생성
      await this.transactionLogRepository.create(ADMIN_ID, user.id, 1000000, 0, { tx });

      // 저장된 이메일 인증번호 삭제
      await this.authRepository.deleteEmailVerificationCode(email, { tx });
      return user;
    });

    // password 제외하기
    const { password: _, ...userWithoutPassword } = createdUser;

    return userWithoutPassword;
  };

  /** 인증번호 발송 */
  sendEmail = async (email) => {
    const verificationCode = await sendEmailVerificationCode(email);
    await redis.set(email, verificationCode);
    return;
  };

  /** 인증번호 확인 */
  verifyEmail = async (email, verificationCode) => {
    const savedCode = await redis.get(email);
    if (!savedCode || savedCode !== verificationCode) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.EMAIL.INVALID);
    }
    return true;
  };

  /** 로그인 */
  signIn = async (email, password) => {
    // email로 찾기
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    // 비밀번호 일치여부
    const comparePassword = await compareWithHashed(password, user.password);
    if (!comparePassword) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }
    const payload = { userId: user.id };

    // accessToken, refreshToken 발급
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // refresh Token hash 후 DB에 저장
    const hashedRefreshToken = await hash(refreshToken);
    await this.authRepository.upsertRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  };

  /** 로그아웃 */
  signOut = async (userId) => {
    // user 찾기
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }

    // 토큰 삭제
    await this.authRepository.deleteRefreshToken(userId);
  };

  /** 토큰 재발급 */
  renewTokens = async (userId) => {
    const payload = { userId };

    // accessToken, refreshToken 발급
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // refresh Token hash 후 DB에 저장
    const hashedRefreshToken = await hash(refreshToken);
    await this.authRepository.upsertRefreshToken(userId, hashedRefreshToken);

    return { accessToken, refreshToken };
  };
}

export default AuthService;
