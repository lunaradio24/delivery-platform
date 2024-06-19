class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findRefreshTokenByUserId = async (userId) => {
    const auth = await this.prisma.auth.findUnique({
      where: { userId },
    });
    return auth.refreshToken;
  };


  /** 로그아웃 */

  // 토큰 삭제
  deleteRefreshToken = async (userId) => {
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
        userId,
        refreshToken,
      },
    });
  };
}

export default AuthRepository;
