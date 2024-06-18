import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { ORDER_STATUS } from '../constants/order.constant.js';

export class OrderService {
  // constructor(orderRepository) {
  //   this.orderRepository = orderRepository;
  // }
  orderRepository = new OrderRepository();

  //  주문 요청 API
  // 인증 후 주문 > userwallet 잔액 확인하여 메뉴 금액만큼 차감 진행 + tradeHistory 데이터 생성
  // +ordersTable + ordersItems 데이터 생성 + cartItems 데이터 삭제
  createOrder = async (userId, userWallet, storeId, orderItems) => {
    // 메뉴 가격 구하기
    let totalPrice = 0;
    // orderItems 배열에서 각 메뉴의 가격을 조회하여 총 주문 금액 계산
    for (const item of orderItems) {
      const menuId = item.menuId;
      const quantity = item.quantity;
      const menuPrice = await this.orderRepository.getMenuPrice(menuId);

      // 각 아이템의 가격과 수량을 곱하여 총 가격을 계산
      const itemTotal = menuPrice * quantity;
      totalPrice += itemTotal;
    }
    // 총 주문금액보다  사용자의 잔액이 낮으면 오류 바환
    if (userWallet < totalPrice) {
      throw new HttpError.BadRequest(MESSAGES.ORDER.NO_WALLET);
    }

    const createResume = await this.orderRepository.createdOrder(userId, storeId, orderItems, totalPrice, userCartId);

    return createResume;
  };

  //  주문 취소 API
  cancelOrder = async (userId, id) => {
    const cancelOrder = await this.orderRepository.cancelOrder(userId, id);

    //주문이 없거나, 해당 유저의 주문이 아니라면 오류 반환
    if (!cancelOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDER.NODATA);
    }

    //주문이 있지만 이미 취소 상태라면 오류 반환
    if (cancelOrder.status === ORDER_STATUS[4]) {
      throw new HttpError.BadRequest(MESSAGES.ORDER.CANCEL.CANCEL_SAME);
    }

    return cancelledOrder; // 취소된 주문 객체 반환
  };

  //  주문 내역 목록 조회 API
  getAdminOrders = async () => {
    let getAdminOrders = await this.orderRepository.getAdminOrders();
    return getAdminOrders;
  };
  getOwnerOrders = async (id) => {
    let getOwnerOrders = await this.orderRepository.getOwnerOrders(id);
    return getOwnerOrders;
  };
  getUserOrders = async (id) => {
    let getUserOrders = await this.orderRepository.getUserOrders(id);
    return getUserOrders;
  };

  //  주문 내역 상세 조회 API
  getOwnerDetailOrders = async (user, id) => {
    let getOwnerDetailOrders = await this.orderRepository.getOwnerDetailOrders(user, id);
    if (!getOwnerDetailOrders) {
      throw new HttpError.NotFound(MESSAGES.ORDER.NODATA);
    }
    return getOwnerDetailOrders;
  };
  getUserDetailOrders = async (user, id) => {
    let getUserDetailOrders = await this.orderRepository.getUserDetailOrders(user, id);
    if (!getUserDetailOrders) {
      throw new HttpError.NotFound(MESSAGES.ORDER.NODATA);
    }
    return getUserDetailOrders;
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (user, id, status) => {
    const statusUpdateOrder = await this.orderRepository.statusUpdateOrder(user, id, status);

    if (!statusUpdateOrder) {
      throw new HttpError.NotFound(MESSAGES.ORDER.NODATA);
    }

    //주문이 있지만 요청한 상태와 동일하다면 오류 반환
    if (cancelOrder.status === ORDER_STATUS[4]) {
      throw new HttpError.BadRequest(MESSAGES.ORDER.STATUS_UPDATE.STATUS_SAME);
    }

    return statusUpdateOrder;
  };
}
