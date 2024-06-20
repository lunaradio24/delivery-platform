class BaseRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createTransaction = async (callback) => {
    return await this.prisma.$transaction(callback, {
      timeout: 10000, // 타임아웃을 10초로 설정
    });
  };
}

export default BaseRepository;
