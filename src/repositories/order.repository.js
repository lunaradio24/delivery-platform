import { ORDER_STATUS } from '../constants/order.constant.js';
import BaseRepository from './base.repository.js';

class OrderRepository extends BaseRepository {
  //  주문 요청 API / 전달하는 변수에 cartId 추가
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

    // if (cartId) {
    //   await tx.cartItem.delete({
    //     where: { id: cartId }, //cart 데이터 삭제
    //   });
    // }

    return createdOrder;
  };

  cancelOrder = async (orderId, { tx }) => {
    const orm = tx || this.prisma;
    // const cancelOrder = await this.prisma.$transaction(async (tx) => { return cancelOrder;})
    const cancelUpdateOrder = await orm.order.update({
      where: { id: +orderId },
      data: { status: 4 },
    });

    // // 고객의 잔액 업데이트
    // await orm.user.update({
    //   where: { id: userId },
    //   data: { wallet: { increment: cancelUpdateOrder.totalPrice } }, //고객의 잔액을 totalPrice만큼 증가
    // });

    // // admin 잔액 차감
    // const adminId = 1;
    // await orm.user.update({
    //   where: { id: adminId },
    //   data: { wallet: { decrement: cancelUpdateOrder.totalPrice } },
    // });

    return cancelUpdateOrder;
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
  statusUpdateOrder = async (orderId, status, { tx }) => {
    const orm = tx || this.prisma;
    // const statusUpdate = await this.prisma.$transaction(async (tx) => {})
    const updateOrder = await orm.order.update({
      where: { id: +orderId },
      data: { status: status },
    });

    // 3 or 4로 변경 시 금액이 수정되긴 하지만, 다른 상태로 바꾸고 다시 3 or 4로 수정할 경우 금액이 다시 증가함

    // 리팩토링 필요
    // if (updateOrder.status === 3) {
    //   // 배달 완료 시 사장 잔액 업데이트
    //   await tx.user.update({
    //     where: { id: userId },
    //     data: { wallet: { increment: updateOrder.totalPrice } },
    //   });

    //   // admin 잔액 차감
    //   const adminId = 1;
    //   await tx.user.update({
    //     where: { id: adminId },
    //     data: { wallet: { decrement: updateOrder.totalPrice } },
    //   });
    // }

    // // 리팩토링 필요
    // if (updateOrder.status === 4) {
    //   // 주문 취소 시 고객 잔액 업데이트
    //   await tx.user.update({
    //     where: { id: updateOrder.customerId },
    //     data: { wallet: { increment: updateOrder.totalPrice } },
    //   });

    //   // admin 잔액 차감
    //   const adminId = 1;
    //   await tx.user.update({
    //     where: { id: adminId },
    //     data: { wallet: { decrement: updateOrder.totalPrice } },
    //   });
    // }

    return updateOrder;

    // return statusUpdate;
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
