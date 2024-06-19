class UserRepository {
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
        nickname: nickname,
        address: address,
        image: image,
        contactNumber: contactNumber,
      },
    });
  };

  // 고객 잔액 차감 메소드
  // await tx.user.update({
  //   where: { id: userId },
  //   data: { wallet: { decrement: createdOrder.totalPrice } }, //고객의 잔액을 totalPrice만큼 차감
  // });

  // ADMIN 잔액 증가 메소드
  // const adminId = 1;
  // await tx.user.update({
  //   where: { id: adminId },
  //   data: { wallet: { increment: createdOrder.totalPrice } },
  // });
}

export default UserRepository;
