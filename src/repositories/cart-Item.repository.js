class CartRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 장바구니 아이템 추가 메서드
  createCartItem = async (customerId, storeId, menuId) => {
    return await this.prisma.cartItem.create({
      data: {
        customerId,
        storeId,
        menuId,
      },
    });
  };

  //장바구니 조회 메서드
  getMyCartById = async (customerId) => {
    return await this.prisma.user.findUnique({
      where: { id: customerId },
      include: { cart: true },
    });
  };

  //장바구니 아이템 조회 메서드
  getMyCartItemById = async (customerId, storeId, menuId) => {
    return await this.prisma.cartItem.findUnique({
      where: {
        id: storeId,
        menu_id: menuId,
      },
    });
  };

  // 장바구니 아이템 수 추가하는 메서드
  increaseCartItem = async (customerId, menuId, quantity) => {
    return await this.prisma.cartItem.update({
      where: {
        id: menuId,
      },
      data: {
        quantity,
      },
    });
  };

  decreaseCartItem = async (customerId, menuId, quantity) => {
    return await this.prisma.cartItem.update({
      where: {
        id: menuId,
      },
      data: {
        quantity,
      },
    });
  };

  deleteCartItem = async (menuId) => {
    return await this.prisma.cartItem.delete({
      where: { id: menuId },
    });
  };
}

export default CartRepository;
