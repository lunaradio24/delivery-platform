import { prisma } from '../utils/prisma.util.js';
import { hash, compareWithHashed, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';
import { SALT_ROUNDS } from '../constants/auth.constant.js';

export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /** 회원가입 */
  // email 확인하기
  getByEmail = async (email) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  };

  // nickname 확인하기
  getByNickname = async (nickname) => {
    const user = await prisma.user.findUnique({
      where: { nickname },
    });
    return user;
  };

  create = async ({ email, password, passwordConfirm, nickname, role, contactNumber, address, image }) => {
    // 비밀번호 암호화
    const hashedPassword = await hash(password, SALT_ROUNDS);

    // user 생성하기
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        role,
        contactNumber,
        address,
        image,
      },
    });
    // password 제외하기
    const { password: _password, ...withoutPasswordUser } = user;
    return withoutPasswordUser;
  };

  /** 로그아웃 */
  // user 찾기
  findById = async (userId) => {
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    return user;
  }

  // 토큰 삭제
  invalidateToken = async (userId) => {
    await this.prisma.auth.update({
      where: { userId },
      data: {
        refreshToken: null,
        },
    });
  };
}
