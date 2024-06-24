import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ADMIN_ID } from '../constants/auth.constant.js';
import { TRANSACTION_TYPE, ROLES, ORDER_STATUS } from '../constants/enum.constant.js';

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

  // 주문할 메뉴들의 유효성을 검증하는 함수
  validateOrderItems = async (storeId, orderItems) => {
    // orderItems 중에 현재 menu DB에 있는 것만 가져옴
    const orderMenuIds = orderItems.map((item) => item.menuId);
    const validMenus = await this.menuRepository.findMenusByMenuIds(orderMenuIds);

    // orderItems 중에 현재 존재하지 않는 메뉴가 포함되어 있는지 검증
    if (validMenus.length < orderItems.length) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CREATE.BAD_REQUEST.INCLUDE_INVALID_MENU);
    }

    // 주문할 메뉴들이 해당 storeId의 가게에 속하는지 검증
    const validOrderItems = validMenus.map((menu, index) => {
      if (menu.storeId !== storeId) {
        throw new HttpError.BadRequest(MESSAGES.ORDERS.CREATE.BAD_REQUEST.NOT_FROM_SAME_STORE);
      }
      return {
        menuId: menu.id,
        price: menu.price,
        quantity: orderItems[index].quantity,
      };
    });

    return validOrderItems;
  };

  // 주문할 메뉴들의 총 가격을 계산하는 함수
  getTotalPrice = (orderItems) => {
    const totalPrice = orderItems.reduce((prev, currItem) => {
      return prev + currItem.price * currItem.quantity;
    }, 0);
    return totalPrice;
  };

  // 주문 요청
  createOrder = async (customerId, userWallet, storeId, orderItems) => {
    // 현재 존재하는 가게인지 확인
    const existingStore = await this.storeRepository.findByStoreId(storeId);
    if (!existingStore) {
      throw new HttpError.NotFound(MESSAGES.STORES.COMMON.NOT_FOUND);
    }

    // 주문할 메뉴들의 유효성 검증
    const validOrderItems = await this.validateOrderItems(storeId, orderItems);

    // 총 주문 금액 계산
    const totalPrice = this.getTotalPrice(validOrderItems);

    // 총 주문금액보다  사용자의 잔액이 낮으면 에러
    if (userWallet < totalPrice) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CREATE.BAD_REQUEST.NOT_ENOUGH_MONEY);
    }

    // Transaction 생성
    const createdOrder = await this.orderRepository.createTransaction(async (tx) => {
      // orders 테이블에 DB 생성
      const createdOrder = await this.orderRepository.createOrder(customerId, storeId, totalPrice, {
        tx,
      });

      // order_items 테이블에 createMany로 생성할 데이터 배열 포맷
      const orderItemData = validOrderItems.map((item) => ({
        orderId: createdOrder.id,
        menuId: item.menuId,
        price: item.price,
        quantity: item.quantity,
      }));

      // order_items 테이블에 DB 생성
      await this.orderItemRepository.createOrderItems(orderItemData, { tx });

      // 고객의 잔액 차감
      await this.userRepository.deductWallet(customerId, totalPrice, { tx });

      // admin 잔액 증가
      await this.userRepository.addWallet(ADMIN_ID, totalPrice, { tx });

      // transaction log 기록
      await this.transactionLogRepository.create(customerId, ADMIN_ID, totalPrice, TRANSACTION_TYPE['PAYMENT'], { tx });

      // cart 테이블에서 삭제할 데이터 배열 포맷
      const toBeDeleted = orderItemData.map((item) => ({
        customerId: customerId,
        menuId: item.menuId,
      }));

      // 장바구니에서 주문한 메뉴 삭제
      await this.cartRepository.deleteCartItems(toBeDeleted, { tx });

      // Transaction의 return 값
      return createdOrder;
    });

    // createOrder 메소드의 반환 값
    const orderData = {
      orderId: createdOrder.id,
      storeName: createdOrder.store.name,
      customerId: customerId,
      orderItems: validOrderItems,
      totalPrice: totalPrice,
      orderedAt: createdOrder.createdAt,
    };

    return orderData;
  };

  //  주문 취소
  cancelOrder = async (customerId, orderId) => {
    // 존재하는 주문인지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);

    // 주문자 본인이 맞는지 확인
    if (customerId !== order.customerId) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.COMMON.NO_ACCESS_RIGHT);
    }

    //주문이 있지만 이미 취소 상태라면 오류 반환
    if (order.status === ORDER_STATUS['CANCELLED']) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CANCEL.CANCEL_SAME);
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
      await this.transactionLogRepository.create(ADMIN_ID, customerId, order.totalPrice, TRANSACTION_TYPE['REFUND'], {
        tx,
      });

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

  // 주문 내역 목록 조회
  getOrderList = async (user) => {
    // 사장인 경우
    if (user.role === ROLES['BUSINESS']) {
      const store = await this.storeRepository.findByOwnerId(user.id);
      const orders = await this.orderRepository.findListByStoreId(store.id);
      return orders;
    }
    // 고객인 경우
    if (user.role === ROLES['PERSONAL']) {
      const orders = await this.orderRepository.findListByCustomerId(user.id);
      return orders;
    }
  };

  // 주문 내역 상세 조회
  getOrderDetail = async (user, orderId) => {
    // 존재하는 주문인지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);
    }

    // 사장이면
    if (user.role === ROLES['BUSINESS']) {
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
    if (user.role === ROLES['PERSONAL']) {
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

  // 주문 상태 변경
  statusUpdateOrder = async (ownerId, orderId, newStatus) => {
    // 존재하는 주문인지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order) throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);

    // 본인 가게의 주문인지 확인
    const store = await this.storeRepository.findByOwnerId(ownerId);
    if (!store || (store && store.id !== order.storeId)) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.COMMON.NO_ACCESS_RIGHT);
    }

    //이미 배달완료 상태면 주문 상태 변경 불가
    if (order.status === ORDER_STATUS['DELIVERED']) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.UPDATE_STATUS.FORBIDDEN);
    }
    // 이미 취소된 주문이면 주문 상태 변경 불가
    if (order.status === ORDER_STATUS['CANCELLED']) {
      throw new HttpError.Forbidden(MESSAGES.ORDERS.CANCEL.FORBIDDEN);
    }

    // 주문이 있지만 요청한 상태와 동일하다면 오류 반환
    if (order.status === newStatus) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.UPDATE_STATUS.SAME_STATUS);
    }

    // Transaction 생성
    const updatedOrderStatus = this.orderRepository.createTransaction(async (tx) => {
      // 주문 상태 변경
      const statusUpdatedOrder = await this.orderRepository.statusUpdateOrder(orderId, newStatus, { tx });

      // 배달 완료 시
      if (newStatus === ORDER_STATUS['DELIVERED']) {
        await this.userRepository.deductWallet(ADMIN_ID, order.totalPrice, { tx }); //admin 잔액차감
        await this.userRepository.addWallet(ownerId, order.totalPrice, { tx }); //사장 잔액증가
        await this.transactionLogRepository.create(
          ADMIN_ID,
          ownerId,
          order.totalPrice,
          TRANSACTION_TYPE['SETTLEMENT'],
          { tx },
        ); // transaction log 기록
        await this.storeRepository.storeAddWallet(ownerId, order.totalPrice, { tx }); // 가게의 총 매출액 증가.totalSales;
      }

      // 주문 취소 시
      if (newStatus === ORDER_STATUS['CANCELLED']) {
        const customerId = order.customerId;
        await this.userRepository.deductWallet(ADMIN_ID, order.totalPrice, { tx }); // admin 잔액 차감
        await this.userRepository.addWallet(customerId, order.totalPrice, { tx }); // 고객잔액 증가
        await this.transactionLogRepository.create(ADMIN_ID, customerId, order.totalPrice, TRANSACTION_TYPE['REFUND'], {
          tx,
        }); // transaction log 기록
      }

      return statusUpdatedOrder;
    });

    return updatedOrderStatus;
  };
}

export default OrderService;
