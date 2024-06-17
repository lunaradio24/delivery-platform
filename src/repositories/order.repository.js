import { prisma } from '../utils/prisma.util.js';

export class OrderRepository {
  // constructor(prisma) {
  //   this.prisma = prisma;
  // }

  //  주문 요청 API
  createOrder = async () => {
    const createOrder = await prisma.order.create({
      data: {}, //Order, OrderItem, tradeHistory, cart 데이터 삭제
      //반환 : orderId, storeName, userId, menuName,price,quantity,useraddress,sumPrice,ordercreated
    });

    return createOrder;
  };

  //  주문 취소 API
  cancelOrder = async () => {
    const cancelOrder = await prisma.order.delete({
      where: {}, //반환 : orderId
    });

    return cancelOrder;
  };

  //  주문 내역 목록 조회 API
  getOrder = async () => {
    const getOrder = await prisma.order.findMany({
      where: {}, //role에 따라 CUSTOMER or OWNER 내역
    });

    return getOrder;
  };

  //  주문 내역 상세 조회 API
  getDetailOrder = async () => {
    const getDetailOrder = await prisma.order.findUnique({
      where: {}, //role에 따라 CUSTOMER or OWNER 내역
    });

    return getDetailOrder;
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async () => {
    const statusUpdateOrder = await prisma.order.update({
      where: {},
    });

    return statusUpdateOrder;
  };
}
