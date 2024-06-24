import BaseRepository from './base.repository.js';
import { ORDER_STATUS } from '../constants/enum.constant.js';

class OrderRepository extends BaseRepository {
  // 주문 요청
  createOrder = async (customerId, storeId, totalPrice, { tx } = {}) => {
    const orm = tx || this.prisma;
    const createdOrder = await orm.order.create({
      data: {
        storeId: Number(storeId),
        customerId,
        totalPrice,
      },
      include: {
        store: { select: { name: true, contactNumber: true, address: true } },
        orderItem: {
          select: {
            menu: { select: { name: true } },
            quantity: true,
            price: true,
          },
        },
      },
    });

    return createdOrder;
  };

  // 주문 취소
  cancelOrder = async (orderId, { tx } = {}) => {
    const orm = tx || this.prisma;
    const cancelUpdateOrder = await orm.order.update({
      where: { id: Number(orderId) },
      data: { status: ORDER_STATUS['CANCELLED'] },
    });

    return cancelUpdateOrder;
  };

  // 주문 목록 조회 (CUSTOMER)
  findListByCustomerId = async (customerId) => {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        store: { select: { name: true, contactNumber: true, address: true } },
        orderItem: {
          select: {
            menu: { select: { name: true } },
            quantity: true,
            price: true,
          },
        },
      },
    });
    return orders;
  };

  // 주문 목록 조회 (BUSINESS OWNER)
  findListByStoreId = async (storeId) => {
    const orders = await this.prisma.order.findMany({
      where: { storeId },
      include: {
        customer: { select: { nickname: true, contactNumber: true, address: true } },
        orderItem: {
          select: {
            menu: { select: { name: true } },
            quantity: true,
            price: true,
          },
        },
      },
    });
    return orders;
  };

  // 주문 상세 조회
  findByOrderId = async (orderId) => {
    const order = await this.prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        customer: { select: { nickname: true, contactNumber: true, address: true } },
        store: { select: { name: true, contactNumber: true, address: true } },
        orderItem: {
          select: {
            menu: { select: { name: true } },
            quantity: true,
            price: true,
          },
        },
      },
    });
    return order;
  };

  //  주문 상태 변경 API (BUSINESS OWNER)
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
