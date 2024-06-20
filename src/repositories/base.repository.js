class BaseRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createTransaction = async (callback) => {
    return await this.prisma.$transaction(callback);
  };
}

export default BaseRepository;
