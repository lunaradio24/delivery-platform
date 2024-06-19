import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }
  //  주문 요청 API
  // 인증 후 주문 > userwallet 잔액 확인하여 메뉴 금액만큼 차감 진행 + tradeHistory 데이터 생성
  // +ordersTable + ordersItems 데이터 생성 + cartItems 데이터 삭제
  createOrder = async (req, res, next) => {
    try {
      const { id: userId, wallet: userWallet } = req.user;
      const { cartId, storeId, orderItems } = req.body;

      const createdOrder = await this.orderService.createOrder(userId, userWallet, storeId, orderItems, cartId);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDERS.CREATED.SUCCEED,
        data: createdOrder,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  //  주문 취소 API
  cancelOrder = async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { orderId } = req.params;

      const cancelOrder = await this.orderService.cancelOrder(userId, orderId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.ORDERS.CANCEL.SUCCEED,
        data: { orderId: cancelOrder.id, status: cancelOrder.status, wallet: cancelOrder.wallet },
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 내역 목록 조회 API
  // getOrderList
  getOrders = async (req, res, next) => {
    try {
      const user = req.user;

      //in service file,
      const getOrders = await this.orderService.getOrders(user);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDERS.LIST.SUCCEED,
        data: getOrders,
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 내역 상세 조회 API
  getDetailOrder = async (req, res, next) => {
    try {
      const user = req.user;
      const { orderId } = req.params;

      const getDetailOrder = await this.orderService.getDetailOrder(user, orderId);

      if (!getDetailOrder) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: HTTP_STATUS.NOT_FOUND,
          message: MESSAGES.ORDERS.NO_DATA,
        });
      }

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDERS.DETAIL.SUCCEED,
        data: getDetailOrder,
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (req, res, next) => {
    try {
      const user = req.user;
      const { orderId } = req.params;
      const { status } = req.body;

      const statusUpdateOrder = await this.orderService.statusUpdateOrder(user, orderId, status);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDERS.STATUS_UPDATE.SUCCEED,
        data: { status: statusUpdateOrder.status },
      });
    } catch (err) {
      next(err);
    }
  };
}

export default OrderController;
