import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ORDER_STATUS } from '../constants/order.constant.js';
import { ADMIN_ID } from '../constants/user.constant.js';

class OrderService {
  constructor(
    orderRepository,
    orderItemRepository,
    menuRepository,
    userRepository,
    transactionLogRepository,
    storeRepository,
    cartRepository,
  ) {
    this.orderRepository = orderRepository;
    this.storeRepository = storeRepository;
    this.orderItemRepository = orderItemRepository;
    this.menuRepository = menuRepository;
    this.userRepository = userRepository;
    this.transactionLogRepository = transactionLogRepository;
    this.cartRepository = cartRepository;
  }

  getTotalPrice = async (orderItems) => {
    let totalPrice = 0;
    // orderItems 배열에서 각 메뉴의 가격을 조회하여 총 주문 금액 계산
    for (const item of orderItems) {
      const quantity = item.quantity;
      const menuId = item.menuId;
      const menu = await this.menuRepository.findMenuByMenuId(menuId);
      const itemTotal = menu.price * quantity;
      totalPrice += itemTotal;
    }
    return totalPrice;
  };

  validateOrderItems = async (storeId, orderItems) => {
    for (const item of orderItems) {
      const menu = await this.menuRepository.findMenuByMenuId(item.menuId);
      if (!menu) throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);
      if (menu.storeId !== storeId) {
        return false;
      }
    }
    return true;
  };

  // 주문 요청 API
  createOrder = async (userId, userWallet, storeId, orderItems) => {
    // 주문할 메뉴들이 해당 storeId의 가게에 속하는지 검증
    const isValidItems = await this.validateOrderItems(storeId, orderItems);
    if (!isValidItems) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.COMMON.BAD_REQUEST);
    }

    // 총 주문 금액 계산
    const totalPrice = await this.getTotalPrice(orderItems);

    // 총 주문금액보다  사용자의 잔액이 낮으면 에러
    if (userWallet < totalPrice) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CREATE.NOT_ENOUGH_MONEY);
    }

    // Transaction 생성
    const createdOrder = await this.orderRepository.createTransaction(async (tx) => {
      // orders 테이블에 DB 생성
      const createdOrder = await this.orderRepository.createOrder(userId, storeId, totalPrice, {
        tx,
      });

      // order items 테이블에 DB 생성
      for (const item of orderItems) {
        const menuId = item.menuId;
        const menu = await this.menuRepository.findMenuByMenuId(menuId);
        await this.orderItemRepository.createOrderItem(createdOrder.id, item.menuId, menu.price, item.quantity, { tx });
      }

      // 고객의 잔액 차감
      await this.userRepository.deductWallet(userId, totalPrice, { tx });

      // admin 잔액 증가
      await this.userRepository.addWallet(ADMIN_ID, totalPrice, { tx });

      // transaction log 기록
      await this.transactionLogRepository.create(userId, ADMIN_ID, totalPrice, 1, { tx });

      // 장바구니에서 주문한 메뉴 삭제
      for (const item of orderItems) {
        await this.cartRepository.deleteCartItem(userId, item.menuId, { tx });
      }

      return createdOrder;
    });

    const data = {
      orderId: createdOrder.id,
      storeName: createdOrder.store.name,
      userId: createdOrder.customerId,
      menu: orderItems.map((item) => ({
        menuId: item.menuId, // 메뉴 ID
        quantity: item.quantity, // 수량
      })),
      address: createdOrder.customer.address,
      totalPrice: createdOrder.totalPrice,
      createdAt: createdOrder.createdAt,
    };

    return data;
  };

  //  주문 취소 API
  cancelOrder = async (customerId, orderId) => {
    // 존재하는 주문인지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);

    // 주문자 본인이 맞는지 확인
    if (customerId !== order.customerId) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.COMMON.NO_ACCESS_RIGHT);
    }

    //주문이 있지만 이미 취소 상태라면 오류 반환
    if (order.status === 4) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CANCEL.FORBIDDEN);
    }

    // Transaction 생성
    const [cancelledOrder, customer] = await this.orderRepository.createTransaction(async (tx) => {
      // 주문 상태 변경
      const cancelledOrder = await this.orderRepository.cancelOrder(orderId, { tx });

      // admin 잔액 차감
      await this.userRepository.deductWallet(ADMIN_ID, order.totalPrice, { tx });

      // 고객 잔액 증가
      const customer = await this.userRepository.addWallet(customerId, order.totalPrice, { tx });

      // transaction log 기록
      await this.transactionLogRepository.create(ADMIN_ID, customerId, order.totalPrice, 2, { tx });

      return [cancelledOrder, customer];
    });

    // 취소된 주문 객체 반환
    const data = {
      orderId: cancelledOrder.id,
      status: cancelledOrder.status,
      wallet: customer.wallet,
    };
    return data;
  };

  // 주문 내역 목록 조회 API
  getOrderList = async (user) => {
    // 사장인 경우
    if (user.role === 1) {
      const store = await this.storeRepository.findByOwnerId(user.id);
      const orders = await this.orderRepository.findListByStoreId(store.id);
      return orders;
    }
    // 고객인 경우
    if (user.role === 2) {
      const orders = await this.orderRepository.findListByCustomerId(user.id);
      return orders;
    }
  };

  //  주문 내역 상세 조회 API
  getOrderDetail = async (user, orderId) => {
    // 존재하는 주문인지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);
    }

    // 사장이면
    if (user.role === 1) {
      // 본인 가게의 주문인지 확인
      const store = await this.storeRepository.findByOwnerId(user.id);
      if (!store || (store && store.id !== order.storeId)) {
        throw new HttpError.Forbidden(MESSAGES.ORDERS.COMMON.NO_ACCESS_RIGHT);
      }
      // 반환 정보
      return {
        orderId: order.id,
        orderedAt: order.createdAt,
        status: order.status,
        customer: {
          nickname: order.customer.nickname,
          contactNumber: order.customer.contactNumber,
          address: order.customer.address,
        },
        orderItems: order.orderItem.map((item) => ({
          menu: item.menu.name,
          quantity: item.quantity,
          price: item.menu.price,
        })),
        totalPrice: order.totalPrice,
      };
    }

    // 고객이면
    if (user.role === 2) {
      // 주문자 본인이 맞는지 확인
      if (user.id !== order.customerId) {
        throw new HttpError.Forbidden(MESSAGES.ORDERS.COMMON.NO_ACCESS_RIGHT);
      }
      // 반환정보
      return {
        orderId: order.id,
        orderedAt: order.createdAt,
        status: order.status,
        store: {
          storeName: order.store.name,
          contactNumber: order.store.contactNumber,
          address: order.store.address,
        },
        orderItems: order.orderItem.map((item) => ({
          menu: item.menu.name,
          quantity: item.quantity,
          price: item.menu.price,
        })),
        totalPrice: order.totalPrice,
      };
    }
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (ownerId, orderId, newStatus) => {
    // 존재하는 주문인지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);

    // 본인 가게의 주문인지 확인

    const store = await this.storeRepository.findByOwnerId(ownerId);
    console.log(store);
    if (!store || (store && store.id !== order.storeId)) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.COMMON.NO_ACCESS_RIGHT);
    }

    //이미 배달완료 상태면 주문 상태 변경 불가
    if (order.status === 3) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.STATUS_UPDATE.FORBIDDEN);
    }
    // 이미 취소된 주문이면 주문 상태 변경 불가
    if (order.status === 4) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.CANCEL.FORBIDDEN);
    }

    // 주문이 있지만 요청한 상태와 동일하다면 오류 반환
    if (order.status === newStatus) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.STATUS_UPDATE.SAME_STATUS);
    }

    // Transaction 생성
    const updatedOrderStatus = this.orderRepository.createTransaction(async (tx) => {
      // 주문 상태 변경
      const statusUpdatedOrder = await this.orderRepository.statusUpdateOrder(orderId, newStatus, { tx });

      // 배달 완료 시
      if (newStatus === 3) {
        await this.userRepository.deductWallet(ADMIN_ID, order.totalPrice, { tx }); //admin 잔액차감
        await this.userRepository.addWallet(ownerId, order.totalPrice, { tx }); //사장 잔액증가
        await this.transactionLogRepository.create(ADMIN_ID, ownerId, order.totalPrice, 3, { tx }); // transaction log 기록
        await this.storeRepository.storeAddWallet(ownerId, order.totalPrice, { tx }); // 가게의 총 매출액 증가.totalSales;
      }

      // 주문 취소 시
      if (newStatus === 4) {
        const customerId = order.customerId;
        await this.userRepository.deductWallet(ADMIN_ID, order.totalPrice, { tx }); // admin 잔액 차감
        await this.userRepository.addWallet(customerId, order.totalPrice, { tx }); // 고객잔액 증가
        await this.transactionLogRepository.create(ADMIN_ID, customerId, order.totalPrice, 2, { tx }); // transaction log 기록
      }

      return statusUpdatedOrder;
    });

    return updatedOrderStatus;
  };
}

export default OrderService;
