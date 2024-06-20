import { ORDER_STATUS } from '../constants/order.constant.js';
import { ADMIN_ID } from '../constants/user.constant.js';
import BaseRepository from './base.repository.js';

class OrderRepository extends BaseRepository {
  //  주문 요청
  createOrder = async (userId, storeId, totalPrice, { tx } = {}) => {
    const orm = tx || this.prisma;
    const createdOrder = await orm.order.create({
      data: {
        storeId: +storeId,
        customerId: userId,
        totalPrice: totalPrice,
      },
      include: {
        store: true,
        customer: true,
        orderItem: true,
      },
    });

    return createdOrder;
  };

  // 주문 취소
  cancelOrder = async (orderId, { tx } = {}) => {
    const orm = tx || this.prisma;
    const cancelUpdateOrder = await orm.order.update({
      where: { id: Number(orderId) },
      data: { status: 4 },
    });

    return cancelUpdateOrder;
  };

  //  주문 내역 목록 조회 (OWNER)
  getOwnerOrders = async (storeId) => {
    let getOwnerOrders = await this.prisma.order.findMany({
      where: { storeId: storeId },
      include: {
        store: true,
        customer: true,
        orderItem: {
          include: {
            menu: true, // menu 데이터 포함
          },
        },
      },
    });

    getOwnerOrders = getOwnerOrders.map((OwnerOrder) => ({
      orderId: OwnerOrder.id,
      createdAt: OwnerOrder.createdAt,
      status: OwnerOrder.status,
      customerId: OwnerOrder.customerId,
      userNumber: OwnerOrder.customer.contactNumber,
      userAddress: OwnerOrder.customer.address,
      orderItems: OwnerOrder.orderItem.map((item) => ({
        menu: item.menu.name,
        quantity: item.quantity,
        price: item.menu.price,
      })),
      totalPrice: OwnerOrder.totalPrice,
    }));

    return getOwnerOrders;
  };

  // 주문 내역 목록 조회 (CUSTOMER)
  getUserOrders = async (id) => {
    let getUserOrders = await this.prisma.order.findMany({
      where: { customerId: id },
      include: {
        store: true,
        orderItem: {
          include: {
            menu: true, // menu 데이터 포함
          },
        },
      },
    });

    getUserOrders = getUserOrders.map((UserOrder) => ({
      orderId: UserOrder.id,
      createdAt: UserOrder.createdAt,
      storeName: UserOrder.store.name,
      orderItems: UserOrder.orderItem.map((item) => ({
        menu: item.menu.name,
        quantity: item.quantity,
        price: item.menu.price,
      })),
      totalPrice: UserOrder.totalPrice,
    }));

    return getUserOrders;
  };

  // 주문 내역 상세 조회 (OWNER)
  getOwnerDetailOrder = async (storeId, orderId) => {
    let detailOrder = await this.prisma.order.findUnique({
      where: { id: Number(orderId), storeId: Number(storeId) },
      include: {
        store: true,
        customer: true,
        orderItem: {
          include: {
            menu: true, // menu 데이터 포함
          },
        },
      },
    });

    if (!detailOrder) {
      return detailOrder;
    }

    detailOrder = {
      orderId: detailOrder.id,
      createdAt: detailOrder.createdAt,
      status: detailOrder.status,
      customerId: detailOrder.customerId,
      userNumber: detailOrder.customer.contactNumber,
      userAddress: detailOrder.customer.address,
      orderItems: detailOrder.orderItem.map((item) => ({
        menu: item.menu.name,
        quantity: item.quantity,
        price: item.menu.price,
      })),
      totalPrice: detailOrder.totalPrice,
    };

    return detailOrder;
  };

  // 주문 내역 상세 조회 (CUSTOMER)
  getUserDetailOrder = async (userId, orderId) => {
    let getUserOrders = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        store: true,
        orderItem: {
          include: {
            menu: true, // menu 데이터 포함
          },
        },
      },
    });

    if (!getUserOrders) {
      return getUserOrders;
    }

    getUserOrders = {
      storeId: getUserOrders.store.id,
      orderId: getUserOrders.id,
      status: getUserOrders.status,
      createdAt: getUserOrders.createdAt,
      storeName: getUserOrders.store.name,
      orderItems: getUserOrders.orderItem.map((item) => ({
        menu: item.menu.name,
        quantity: item.quantity,
        price: item.menu.price,
      })),
      totalPrice: getUserOrders.totalPrice,
    };

    return getUserOrders;
  };

  //  주문 상태 변경 API (OWNER)
  statusUpdateOrder = async (orderId, status, { tx } = {}) => {
    const orm = tx || this.prisma;
    const updatedOrder = await orm.order.update({
      where: { id: Number(orderId) },
      data: { status: status },
    });

    return updatedOrder;
  };

  //메뉴 가격 함수
  getMenuPrice = async (menuId) => {
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
      select: { price: true },
    });

    return menu.price;
  };
}

export default OrderRepository;
