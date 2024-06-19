import { hash, compareWithHashed, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';

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
    // user 생성하기
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
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

  /** 토큰 재발급 */
  upsertRefreshToken = async (userId, refreshToken) => {
    await this.prisma.auth.upsert({
      where: { userId },
      update: {
        refreshToken,
      },
      create: {
        refreshToken,
      },
    });
  };
}
