class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 인증번호 저장
  saveEmailVerificationCode = async (email, verificationCode) => {
    await this.prisma.email.upsert({
      where: { email },
      update: { verificationCode },
      create: { email, verificationCode },
    });
  };

  // 인증번호 찾기
  findEmailVerificationCode = async (email) => {
    const record = await this.prisma.email.findUnique({ where: { email } });
    return record;
  };

  // 회원가입 완료시 저장된 인증번호 삭제
  deleteEmailVerificationCode = async (email, { tx } = {}) => {
    const orm = tx || this.prisma;
    await orm.email.delete({ where: { email } });
  };

  // 토큰 찾기
  findRefreshTokenByUserId = async (userId) => {
    const auth = await this.prisma.auth.findUnique({ where: { userId } });
    return auth.refreshToken;
  };

  // 토큰 삭제
  deleteRefreshToken = async (userId) => {
    await this.prisma.auth.update({
      where: { userId },
      data: { refreshToken: null },
    });
  };

  // 토큰 재발급
  upsertRefreshToken = async (userId, refreshToken) => {
    await this.prisma.auth.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  };
}

export default AuthRepository;
