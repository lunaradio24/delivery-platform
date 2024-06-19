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

  // userId에 맞는 user 정보 수정
  update = async (userId, nickname, address, image, contactNumber) => {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: user.nickname,
        address: user.address,
        image: user.image,
        contactNumber: user.contactNumber,
      },
    });
  };
}
