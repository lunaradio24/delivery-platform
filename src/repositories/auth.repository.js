class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 인증번호 저장
  saveVerificationEmail = async (email, verificationCode) => {
    await this.prisma.email.upsert({
      where: { email },
      update: { verificationCode },
      create: { email, verificationCode },
    });
  };

  // 인증번호 찾기
  getVerificationByEmail = async (email) => {
    const record = await this.prisma.email.findUnique({
      where: { email },
    });
    return record;
  }

  // 토큰 찾기
  findRefreshTokenByUserId = async (userId) => {
    const auth = await this.prisma.auth.findUnique({
      where: { userId },
    });
    return auth.refreshToken;
  };

  // 토큰 삭제
  deleteRefreshToken = async (userId) => {
    await this.prisma.auth.update({
      where: { userId },
      data: {
        refreshToken: null,
      },
    });
  };

  // 토큰 재발급
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
