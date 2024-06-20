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
}

export default OrderItemRepository;
