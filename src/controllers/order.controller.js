import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { OrderService } from '../services/order.service.js';

export class OrderController {
  // constructor(orderService) {
  //   this.orderService = orderService;
  // } 이 코드 사용법을 몰라서 대기
  orderService = new OrderService();

  //  주문 요청 API
  createOrder = async (req, res, next) => {
    try {
      const id = req.user.id;
      const { storeId, menuId, quantity } = req.body;

      const createOrder = await this.orderService.createOrder(userId, title, aboutMe);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDER.CREATED.SUCCEED,
        createOrder,
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 취소 API
  cancelOrder = async (req, res, next) => {
    try {
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.ORDER.CANCEL.SUCCEED,
        cancelOrder,
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 내역 목록 조회 API
  getOrder = async (req, res, next) => {
    try {
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDER.LIST.SUCCEED,
        getOrder,
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 내역 상세 조회 API
  getDetailOrder = async (req, res, next) => {
    try {
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDER.DETAIL.SUCCEED,
        getDetailOrder,
      });
    } catch (err) {
      next(err);
    }
  };

  //  주문 상태 변경 API
  statusUpdateOrder = async (req, res, next) => {
    try {
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDER.STATUS_UPDATE.SUCCEED,
        statusUpdateOrder,
      });
    } catch (err) {
      next(err);
    }
  };
}
