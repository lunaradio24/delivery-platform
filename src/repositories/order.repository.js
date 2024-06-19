import { ORDER_STATUS } from '../constants/order.constant.js';

export class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  //  주문 요청 API
  createdOrder = async (userId, storeId, orderItems, totalPrice, userCartId) => {
    const transactionCreatedOrder = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        //Order 데이터 생성
        data: {
          storeId: storeId,
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
          orderItem: true,
        },
      });

      if (userCartId) {
        await tx.cartItem.delete({
          where: { id: userCartId }, //cart 데이터 삭제
        });
      }

      // 고객의 잔액 차감
      await tx.user.update({
        where: { id: userId },
        data: { wallet: { decrement: createdOrder.totalPrice } }, //고객의 잔액을 totalPrice만큼 증가
      });

      // admin 잔액 증가
      const adminId = 1;
      await tx.user.update({
        where: { id: adminId },
        data: { wallet: { increment: createdOrder.totalPrice } },
      });

      let data = {
        orderId: createdOrder.id,
        storeName: createdOrder.store.name,
        userId: createdOrder.customerId,
        menu: createdOrder.orderItem.map((item) => ({
          menuId: item.menuId, // 메뉴 ID
          quantity: item.quantity, // 수량
        })),
        address: createdOrder.customer.address,
        totalPrice: createdOrder.totalPrice,
        createdAt: createdOrder.createdAt,
      };
      return data;
    });

    return transactionCreatedOrder;
  };

  cancelOrder = async (userId, id) => {
    const cancelOrder = await prisma.$transaction(async (tx) => {
      const checkOrder = await tx.order.findUnique({
        where: { id, customerId: userId }, //반환 : orderId
      });

      if (!checkOrder) {
        return checkOrder;
      }

      if (checkOrder.status === ORDER_STATUS[4]) {
        return checkOrder;
      }

      const cancelUpdateOrder = await tx.order.update({
        where: { id },
        data: { status: ORDER_STATUS[4] },
      });

      // 고객의 잔액 업데이트
      await tx.user.update({
        where: { id: userId },
        data: { wallet: { increment: checkOrder.totalPrice } }, //고객의 잔액을 totalPrice만큼 증가
      });

      // admin 잔액 차감
      const adminId = 1;
      await tx.user.update({
        where: { id: adminId },
        data: { wallet: { decrement: checkOrder.totalPrice } },
      });

      return cancelUpdateOrder;
    });

    return cancelOrder;
  };

  //  주문 내역 목록 조회 API
  //Admin 주문내역 전체
  getAdminOrders = async () => {
    let getAllOrders = await prisma.order.findMany({
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
    return getAllOrders;
  };

  //Owner 주문내역 전체
  getOwnerOrders = async (storeId) => {
    let getOwnerOrders = await prisma.order.findMany({
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

    getOwnerOrders = getOwnerOrders.map((OwnerOrder) => {
      return {
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
        totalPrice: order.totalPrice,
      };
    });

    return getOwnerOrders;
  };

  //User 주문내역 전체
  getUserOrders = async (id) => {
    let getUserOrders = await prisma.order.findMany({
      where: { id: id },
      include: {
        store: true,
        orderItem: {
          include: {
            menu: true, // menu 데이터 포함
          },
        },
      },
    });

    getUserOrders = getUserOrders.map((UserOrder) => {
      return {
        orderId: UserOrder.id,
        createdAt: UserOrder.createdAt,
        storeName: UserOrder.store.name,
        orderItems: UserOrder.orderItem.map((item) => ({
          menu: item.menu.name,
          quantity: item.quantity,
          price: item.menu.price,
        })),
        totalPrice: UserOrder.totalPrice,
      };
    });

    return getUserOrders;
  };

  //  주문 내역 상세 조회 API

  //Owner 주문 내역 상세 조회
  getOwnerDetailOrders = async (storeId, id) => {
    let getOwnerDetailOrders = await prisma.order.findUnique({
      where: {
        id: id,
        storeId: storeId,
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

    if (!getOwnerDetailOrders) {
      return getOwnerDetailOrders;
    }

    getOwnerDetailOrders = getOwnerDetailOrders.map((OwnerOrder) => {
      return {
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
        totalPrice: order.totalPrice,
      };
    });

    return getOwnerDetailOrders;
  };

  //User 주문 내역 상세 조회
  getUserDetailOrders = async (userId, id) => {
    const getUserOrders = await prisma.order.findUnique({
      where: { id, customerId: userId },
      include: {
        store: true,
        orderItem: {
          include: {
            menu: true, // menu 데이터 포함
          },
        },
      },
    });

    if (!getUserDetailOrders) {
      return getUserDetailOrders;
    }

    getUserOrders = getUserOrders.map((UserOrder) => {
      return {
        orderId: UserOrder.id,
        createdAt: UserOrder.createdAt,
        storeName: UserOrder.store.name,
        orderItems: UserOrder.orderItem.map((item) => ({
          menu: item.menu.name,
          quantity: item.quantity,
          price: item.menu.price,
        })),
        totalPrice: UserOrder.totalPrice,
      };
    });

    return getUserDetailOrders;
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (user, id, status) => {
    const statusUpdate = await prisma.$transaction(async (tx) => {
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
        const adminId = 1;
        await tx.user.update({
          where: { id: adminId },
          data: { wallet: { decrement: checkOrder.totalPrice } },
        });
      }

      return updateOrder;
    });

    return statusUpdate;
  };

  //메뉴 가격 함수
  getMenuPrice = async (menuId) => {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      select: { price: true },
    });

    return menu.price;
  };
}
