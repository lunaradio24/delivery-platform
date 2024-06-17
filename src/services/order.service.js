import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { OrderRepository } from '../repositories/order.repository.js';

export class OrderService {
  // constructor(orderRepository) {
  //   this.orderRepository = orderRepository;
  // }
  orderRepository = new OrderRepository();

  //  주문 요청 API
  // 인증 후 주문 > userwallet 잔액 확인하여 메뉴 금액만큼 차감 진행 + tradeHistory 데이터 생성
  // +ordersTable + ordersItems 데이터 생성 + cartItems 데이터 삭제
  createOrder = async (userId, title, aboutMe) => {
    const createResume = await this.orderRepository.createOrder(userId, title, aboutMe);

    return createResume;
  };

  //  주문 취소 API
  cancelOrder = async (userId, title, aboutMe) => {
    const createResume = await this.orderRepository.cancelOrder(userId, title, aboutMe);

    return createResume;
  };

  //  주문 내역 목록 조회 API
  getOrder = async (userId, title, aboutMe) => {
    const createResume = await this.orderRepository.getOrder(userId, title, aboutMe);

    return createResume;
  };

  //  주문 내역 상세 조회 API
  getDetailOrder = async (userId, title, aboutMe) => {
    const createResume = await this.orderRepository.getDetailOrder(userId, title, aboutMe);

    return createResume;
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (userId, title, aboutMe) => {
    const createResume = await this.orderRepository.statusUpdateOrder(userId, title, aboutMe);

    return createResume;
  };
}
