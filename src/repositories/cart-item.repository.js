class CartRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 장바구니 아이템 추가 메서드
  createCartItem = async (customerId, storeId, menuId) => {
    return await this.prisma.cartItem.create({
      data: { customerId, storeId: Number(storeId), menuId: Number(menuId) },
    });
  };

  //장바구니 조회 메서드
  getMyCartByCustomerId = async (customerId, { tx } = {}) => {
    const orm = tx || this.prisma;
    return await orm.cartItem.findMany({
      where: { customerId },
    });
  };

  //장바구니 아이템 조회 메서드
  getMyCartItemByMenuId = async (customerId, menuId) => {
    return await this.prisma.cartItem.findUnique({
      where: { customerId_menuId: { customerId, menuId } },
    });
  };

  // 장바구니 아이템 수 추가하는 메서드
  increaseCartItem = async (customerId, menuId) => {
    return await this.prisma.cartItem.update({
      where: { customerId_menuId: { customerId, menuId } },
      data: { quantity: { increment: 1 } },
    });
  };

  decreaseCartItem = async (customerId, menuId) => {
    return await this.prisma.cartItem.update({
      where: { customerId_menuId: { customerId, menuId } },
      data: { quantity: { decrement: 1 } },
    });
  };

  deleteCartItemByMenuId = async (customerId, menuId) => {
    return await this.prisma.cartItem.delete({
      where: { customerId_menuId: { customerId, menuId } },
    });
  };

  deleteCartItems = async (toBeDeleted, { tx } = {}) => {
    const orm = tx || this.prisma;
    return await orm.cartItem.deleteMany({
      where: { OR: toBeDeleted }, // OR operator in Prisma allows you to match any of the conditions in the array
    });
  };
}

export default CartRepository;
