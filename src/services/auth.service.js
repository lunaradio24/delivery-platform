import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { hash, compareWithHashed, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';

class AuthService {
  constructor(authRepository, userRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }
  /** 회원가입 */
  signUp = async (email, password, nickname, role, contactNumber, address, image) => {
    // email 중복확인
    const existingEmail = await this.authRepository.getByEmail(email);
    if (existingEmail) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    // nickname 중복확인
    const existingNickname = await this.authRepository.getByNickname(nickname);
    if (existingNickname) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.NICKNAME.DUPLICATED);
    }

    // 비밀번호 암호화
    const hashedPassword = await hash(password);

    // user 생성하기
    const user = await this.authRepository.create({
      email,
      password: hashedPassword,
      nickname,
      role,
      contactNumber,
      address,
      image,
    });
    // password 제외하기
    const { password: _password, ...withoutPasswordUser } = user;
    return withoutPasswordUser;
  };

  /** 로그인 */
  signIn = async (email, password) => {
    // email로 찾기
    const user = await this.authRepository.getByEmail(email);

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
    console.log(hashedRefreshToken);
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
    await this.authRepository.invalidateToken(userId);
  };

  /** 토큰 재발급 */
  renewTokens = async (user) => {
    const payload = { userId: user.id };

    // accessToken, refreshToken 발급
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // refresh Token hash 후 DB에 저장
    const hashedRefreshToken = await hash(refreshToken);
    await this.authRepository.upsertRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  };
}

export default AuthService;
