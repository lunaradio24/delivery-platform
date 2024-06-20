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
      // 각 아이템의 가격과 수량을 곱하여 총 가격을 계산
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

  //  주문 요청 API
  // 인증 후 주문 > userwallet 잔액 확인하여 메뉴 금액만큼 차감 진행 + tradeHistory 데이터 생성
  // +ordersTable + ordersItems 데이터 생성 + cartItems 데이터 삭제
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
      throw new HttpError.BadRequest(MESSAGES.ORDERS.NO_WALLET);
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
        const menuId = item.menuId;
        console.log(userId, menuId);
        await this.cartRepository.deleteCartItem(userId, menuId, { tx });
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
  cancelOrder = async (userId, orderId) => {
    const checkOrder = await this.orderRepository.getUserDetailOrder(userId, orderId);

    //주문이 없거나, 해당 유저의 주문이 아니라면 오류 반환
    if (!checkOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);
    }

    //주문이 있지만 이미 취소 상태라면 오류 반환
    if (checkOrder.status === 4) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CANCEL.CANCEL_SAME);
    }

    // Transaction 생성
    const [cancelledOrder, addedWallet] = await this.orderRepository.createTransaction(async (tx) => {
      // 주문 상태 변경
      const cancelledOrder = await this.orderRepository.cancelOrder(orderId, { tx });

      // admin 잔액 차감
      const deductedWallet = await this.userRepository.deductWallet(ADMIN_ID, checkOrder.totalPrice, { tx });

      // 고객잔액 증가
      const addedWallet = await this.userRepository.addWallet(userId, checkOrder.totalPrice, { tx });

      // transaction log 기록
      await this.transactionLogRepository.create(ADMIN_ID, userId, checkOrder.totalPrice, 2, { tx });

      return [cancelledOrder, addedWallet];
    });

    console.log(addedWallet);
    const data = {
      orderId: cancelledOrder.id,
      status: cancelledOrder.status,
      wallet: addedWallet.wallet,
    };

    return data; // 취소된 주문 객체 반환
  };

  //  주문 내역 목록 조회 API
  getOrders = async (user) => {
    const userId = user.id;
    let getOrder;

    if (user.role === 1) {
      const getStoreId = await this.userRepository.findStoreId(userId);
      const storeId = getStoreId.store.id;
      getOrder = await this.orderRepository.getOwnerOrders(storeId); // owner
    } else if (user.role === 2) {
      getOrder = await this.orderRepository.getUserOrders(userId); // user
    }

    return getOrder;
  };

  //  주문 내역 상세 조회 API
  getDetailOrder = async (user, orderId) => {
    const userId = user.id;
    let getOrder;

    if (user.role === 1) {
      const getStoreId = await this.userRepository.findStoreId(userId);
      const storeId = getStoreId.store.id;
      getOrder = await this.orderRepository.getOwnerDetailOrder(storeId, orderId); // owner
    } else if (user.role === 2) {
      console.log(userId, orderId);
      getOrder = await this.orderRepository.getUserDetailOrder(userId, orderId); // user
    }

    if (!getOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);
    }
    return getOrder;
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (ownerId, orderId, status) => {
    const getStoreId = await this.userRepository.findStoreId(ownerId);
    const storeId = getStoreId.store.id;
    const checkOrder = await this.orderRepository.getOwnerDetailOrder(storeId, orderId);

    //주문이 없거나, 해당 스토어의 주문이 아니라면 오류 반환
    if (!checkOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.NO_DATA);
    }

    //주문이 있지만 요청한 상태와 동일하다면 오류 반환
    if (checkOrder.status === status) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.STATUS_UPDATE.SAME_STATUS);
    }

    //이미 배달완료 상태면 주문 상태 변경 불가
    if (checkOrder.status === 3) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.STATUS_UPDATE.FORBIDDEN);
    }
    // 이미 취소된 주문이면 상태 변경 불가
    if (checkOrder.status === 4) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CANCEL.CANCEL_SAME);
    }

    // Transaction 생성
    const updatedOrderStatus = this.orderRepository.createTransaction(async (tx) => {
      // 주문 상태 변경
      const statusUpdatedOrder = await this.orderRepository.statusUpdateOrder(orderId, status, { tx });

      // 배달 완료 시 admin 잔액 차감, 사장 잔액 증가
      if (status === 3) {
        await this.userRepository.deductWallet(ADMIN_ID, checkOrder.totalPrice, { tx }); //admin 잔액차감
        await this.userRepository.addWallet(ownerId, checkOrder.totalPrice, { tx }); //사장 잔액증가
        await this.transactionLogRepository.create(ADMIN_ID, ownerId, checkOrder.totalPrice, 3, { tx }); // transaction log 기록
        await this.storeRepository.storeAddWallet(ownerId, checkOrder.totalPrice, { tx }); // 가게의 총 매출액 증가.totalSales;
      }

      // 주문 취소 시  admin 잔액 차감 -> 고객 잔액 증가
      if (status === 4) {
        const customerId = checkOrder.customerId;
        await this.userRepository.deductWallet(ADMIN_ID, checkOrder.totalPrice, { tx }); // admin 잔액 차감
        await this.userRepository.addWallet(customerId, checkOrder.totalPrice, { tx }); // 고객잔액 증가
        await this.transactionLogRepository.create(ADMIN_ID, customerId, checkOrder.totalPrice, 2, { tx }); // transaction log 기록
      }

      return statusUpdatedOrder.status;
    });

    return updatedOrderStatus;
  };
}

export default OrderService;
