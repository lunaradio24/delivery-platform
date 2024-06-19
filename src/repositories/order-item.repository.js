class OrderItemRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  findMenuIdsByOrderId = async (orderId, { tx }) => {
    const orm = tx || this.prisma;
    const orderItemIds = await orm.orderItem.findMany({
      where: { orderId },
      select: { menuId: true },
    });
    return orderItemIds;
  };
}

export default OrderItemRepository;
