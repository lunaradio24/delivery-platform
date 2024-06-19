export class BaseRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createTransaction = async () => {
    return await this.prisma.$transaction;
  };
}
