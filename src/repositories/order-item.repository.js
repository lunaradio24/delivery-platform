class OrderItemRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findMenuIdsByOrderId = async (orderId, { tx } = {}) => {
    const orm = tx || this.prisma;
    const orderItems = await orm.orderItem.findMany({
      where: { orderId },
      select: { menuId: true },
    });
    const orderItemIds = orderItems.map((item) => item.menuId);
    return orderItemIds;
  };

  createOrderItems = async (orderItemData, { tx } = {}) => {
    const orm = tx || this.prisma;
    await orm.orderItem.createMany({
      data: orderItemData,
    });
  };
}

export default OrderItemRepository;
