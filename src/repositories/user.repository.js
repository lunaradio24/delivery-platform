import { prisma } from '../utils/prisma.util.js';

export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // userId로 user 찾기
  findById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  };
}
