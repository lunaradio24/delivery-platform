import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ROLES } from '../constants/auth.constant.js';
import { ORDER_STATUS } from '../constants/order.constant.js';
import { ADMIN_ID } from '../constants/user.constant.js';

class OrderService {
  constructor(orderRepository, menuRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.menuRepository = menuRepository;
    this.userRepository = userRepository;
  }

  //  주문 요청 API
  // 인증 후 주문 > userwallet 잔액 확인하여 메뉴 금액만큼 차감 진행 + tradeHistory 데이터 생성
  // +ordersTable + ordersItems 데이터 생성 + cartItems 데이터 삭제
  createOrder = async (userId, userWallet, storeId, orderItems, cartId) => {
    // 메뉴 가격 구하기
    let totalPrice = 0;
    // orderItems 배열에서 각 메뉴의 가격을 조회하여 총 주문 금액 계산
    for (const item of orderItems) {
      const menuId = item.menuId;
      const quantity = item.quantity;
      const menu = await this.menuRepository.getMenuByMenuId(menuId);

      // 각 아이템의 가격과 수량을 곱하여 총 가격을 계산
      const itemTotal = menu.price * quantity;
      totalPrice += itemTotal;
    }
    // 총 주문금액보다  사용자의 잔액이 낮으면 오류 바환
    if (userWallet < totalPrice) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.NO_WALLET);
    }

    // Transaction 생성
    const tx = this.orderRepository.createTransaction();

    // orders 테이블에 DB 생성
    const createdOrder = await this.orderRepository.createOrder(userId, storeId, orderItems, totalPrice, cartId, {
      tx,
    });

    // 고객의 잔액 차감
    const updatedUser = await this.userRepository.메소드이름(userId, createdOrder.totalPrice);

    // admin 잔액 증가
    const updatedAdmin = await this.userRepository.메소드이름(ADMIN_ID, createdOrder.totalPrice);

    // 수정 필요
    const data = {
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
  };

  //  주문 취소 API
  cancelOrder = async (userId, id) => {
    const cancelOrder = await this.orderRepository.cancelOrder(userId, id);

    //주문이 없거나, 해당 유저의 주문이 아니라면 오류 반환
    if (!cancelOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.NO_DATA);
    }

    //주문이 있지만 이미 취소 상태라면 오류 반환
    if (cancelOrder.status === ORDER_STATUS[4]) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.CANCEL.CANCEL_SAME);
    }

    return cancelledOrder; // 취소된 주문 객체 반환
  };

  //  주문 내역 목록 조회 API

  getOrders = async (user) => {
    let getOrder;
    if (user.role === ROLES[1]) {
      const storeId = user.store.id;
      getOrder = await this.orderService.getOwnerOrders(storeId); // owner
    } else if (user.role === ROLES[2]) {
      const id = user.id;
      getOrder = await this.orderService.getUserOrders(id); // user
    }

    return getOrder;
  };

  //  주문 내역 상세 조회 API
  getDetailOrder = async (user, id) => {
    let getOrder;

    if (user.role === ROLES[1]) {
      const storeId = user.store.id;
      getOrder = await this.orderRepository.getOwnerDetailOrders(storeId, orderId); // owner
    } else if (user.role === ROLES[2]) {
      const userId = user.id;
      getOrder = await this.orderRepository.getUserDetailOrders(userId, orderId); // user
    }

    if (!getOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.NODATA);
    }
    return getOrder;
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (user, orderId, status) => {
    const statusUpdateOrder = await this.orderRepository.statusUpdateOrder(user, orderId, status);

    if (!statusUpdateOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.NO_DATA);
    }

    //주문이 있지만 요청한 상태와 동일하다면 오류 반환
    if (cancelOrder.status === ORDER_STATUS[4]) {
      throw new HttpError.BadRequest(MESSAGES.ORDERS.STATUS_UPDATE.SAME_STATUS);
    }

    return statusUpdateOrder;
  };
}

export default OrderService;
