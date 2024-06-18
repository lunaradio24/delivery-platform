import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { hash, compareWithHashed, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';
import { prisma } from '../utils/prisma.util.js';
import { SALT_ROUNDS } from '../constants/auth.constant.js';
import { AuthRepository } from '../repositories/auth.repository.js';

const authRepository = new AuthRepository();

export class AuthService {
  constructor(authRepository, userRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  /** 회원가입 */
  signUp = async ({ email, password, passwordConfirm, nickname, role, contactNumber, address, image }) => {
    // email 중복확인
    const existedEmail = await this.authRepository.getByEmail(email);
    if (existedEmail) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }

    // nickname 중복확인
    const existedNickname = await this.authRepository.getByNickname(nickname);
    if (existedNickname) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.NICKNAME.DUPLICATED);
    }

    // 비밀번호 암호화
    const hashedPassword = await hash(password, SALT_ROUNDS);

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
}
