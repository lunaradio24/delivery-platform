class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 토큰 발급/재발급
  upsertRefreshToken = async (userId, refreshToken) => {
    await this.prisma.auth.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  };

  // 토큰 찾기
  findRefreshTokenByUserId = async (userId) => {
    const { refreshToken } = await this.prisma.auth.findUnique({ where: { userId } });
    return refreshToken;
  };

  // 토큰 삭제
  deleteRefreshToken = async (userId) => {
    await this.prisma.auth.update({
      where: { userId },
      data: { refreshToken: null },
    });
  };
}

export default AuthRepository;
