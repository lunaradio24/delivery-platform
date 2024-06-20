class OrderItemRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findMenuIdsByOrderId = async (orderId, { tx }) => {
    const orm = tx || this.prisma;
    const orderItems = await orm.orderItem.findMany({
      where: { orderId },
      select: { menuId: true },
    });
    return orderItems.map((item) => item.menuId);
  };

  createOrderItem = async (orderId, menuId, price, quantity, { tx }) => {
    const orm = tx || this.prisma;
    await orm.orderItem.create({
      data: { orderId, menuId, price, quantity },
    });
  };
}

export default OrderItemRepository;
