import { ORDER_STATUS } from '../constants/order.constant.js';
import { ADMIN_ID } from '../constants/user.constant.js';
import BaseRepository from './base.repository.js';

class OrderRepository extends BaseRepository {
  //  주문 요청 API
  createOrder = async (userId, storeId, orderItems, totalPrice, { tx }) => {
    const orm = tx || this.prisma;
    const createdOrder = await orm.order.create({
      //Order 데이터 생성
      data: {
        storeId: +storeId,
        customerId: userId,
        orderItem: {
          create: orderItems.map((item) => ({
            menuId: item.menuId, // 메뉴 ID
            quantity: item.quantity, // 수량
          })),
        },
        totalPrice: totalPrice,
      },
      include: {
        store: true,
        customer: true,
        orderItem: true,
      },
    });

    // 장바구니에서 주문한 메뉴 삭제
    // await tx.cartItem.deleteMany({
    //   where: { :  },
    // });

    // transaction log 생성
    await orm.transactionLog.create({
      data: {
        senderId: userId,
        receiverId: ADMIN_ID,
        amount: createdOrder.totalPrice,
        type: 1,
      },
    });

    return createdOrder;
  };

  cancelOrder = async (userId, orderId) => {
    const cancelledOrder = await this.prisma.$transaction(async (tx) => {
      const cancelledOrder = await tx.order.update({
        where: { id: +orderId },
        data: { status: 4 },
      });

      // 고객의 잔액 업데이트
      await tx.user.update({
        where: { id: userId },
        data: { wallet: { increment: cancelledOrder.totalPrice } }, //고객의 잔액을 totalPrice만큼 증가
      });

      // admin 잔액 차감
      await tx.user.update({
        where: { id: ADMIN_ID },
        data: { wallet: { decrement: cancelledOrder.totalPrice } },
      });
      // transaction log 생성
      await tx.transactionLog.create({
        data: {
          senderId: ADMIN_ID,
          receiverId: userId,
          amount: cancelledOrder.totalPrice,
          type: 2,
        },
      });

      return cancelledOrder;
    });

    return cancelledOrder;
  };

  //  주문 내역 목록 조회 API
  //Owner 주문내역 전체
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

  //User 주문내역 전체
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

  //  주문 내역 상세 조회 API

  //Owner 주문 내역 상세 조회
  getOwnerDetailOrder = async (storeId, orderId) => {
    let detailOrder = await this.prisma.order.findUnique({
      where: {
        id: +orderId,
        storeId: +storeId,
      },
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

  //User 주문 내역 상세 조회
  getUserDetailOrder = async (userId, orderId) => {
    let getUserOrders = await this.prisma.order.findUnique({
      where: { id: +orderId, customerId: +userId },
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

  //  주문 상태 변경 API
  statusUpdateOrder = async (user, id, status) => {
    const statusUpdate = await this.prisma.$transaction(async (tx) => {
      const checkOrder = await tx.order.findUnique({
        where: { id: id },
      });

      if (!checkOrder) {
        return checkOrder;
      }

      if (checkOrder.status === status) {
        return checkOrder;
      }

      const updateOrder = await tx.order.update({
        where: { id: id },
        data: { status: status },
      });

      if (updateOrder.status === ORDER_STATUS[3]) {
        // 배달 완료 시 사장 잔액 업데이트
        await tx.user.update({
          where: { id: user.id },
          data: { wallet: { increment: checkOrder.totalPrice } }, //고객의 잔액을 totalPrice만큼 증가
        });

        // admin 잔액 차감
        await tx.user.update({
          where: { id: ADMIN_ID },
          data: { wallet: { decrement: checkOrder.totalPrice } },
        });

        // transaction log 생성
        await tx.transactionLog.create({
          data: {
            senderId: ADMIN_ID,
            receiverId: user.id,
            amount: checkOrder.totalPrice,
            type: 3,
          },
        });
      }

      return updateOrder;
    });

    return statusUpdate;
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
