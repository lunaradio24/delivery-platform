class CartRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // method 작성하시면 됩니다.
  createMyCartById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { userId },
    });
  };
}

export default CartRepository;
