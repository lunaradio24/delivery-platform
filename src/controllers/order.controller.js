import { HTTP_STATUS } from '../constants/http-status.constant.js';
// import {HttpError} from ''
import { MESSAGES } from '../constants/message.constant.js';
import { ROLES } from '../constants/auth.constant.js';

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

      if (!storeId || !orderItems.menuId || !orderItems.quantity) {
        // throw new HttpError.BadRequest(MESSAGE.)
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: HTTP_STATUS.BAD_REQUEST,
          message: MESSAGES.ORDERS.NO_ORDER,
        });
      }

      const createdOrder = await this.orderService.createOrder(userId, userWallet, storeId, orderItems);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.ORDERS.CREATED.SUCCEED,
        data: createdOrder,
      });
    } catch (err) {
      console.log('에러', err);
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
  getOrder = async (req, res, next) => {
    try {
      const user = req.user;
      const { storeId, adminUserId } = req.query;

      let getOrder;

      // role이 admin일 경우
      if (user.role === ROLES[0]) {
        if (!adminStoreId && !adminUserId) {
          getOrder = await this.orderService.getAdminOrders();
        } else if (adminStoreId) {
          getOrder = await this.orderService.getOwnerOrders(adminStoreId);
        } else if (adminUserId) {
          getOrder = await this.orderService.getUserOrders(adminUserId);
        }
      } else if (user.role === ROLES[1]) {
        //in service file,
        //cosnt storeId = await this.storeRepository.findStoreByOwnerId(userId);
        const storeId = user.store.id;
        getOrder = await this.orderService.getOwnerOrders(storeId); // owner
      } else if (user.role === ROLES[2]) {
        const id = user.id;
        getOrder = await this.orderService.getUserOrders(id); // user
      }

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
      const { adminStoreId, adminUserId } = req.query;

      let getDetailOrder;

      if (user.role === ROLES[0]) {
        if ((adminStoreId && adminUserId) || (!adminStoreId && !adminUserId)) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: HTTP_STATUS.BAD_REQUEST,
            message: '1가지 값을 입력해주세요',
          });
        }
        if (adminStoreId) {
          getDetailOrder = await this.orderService.getOwnerDetailOrders(adminStoreId, id);
        } else if (adminUserId) {
          getDetailOrder = await this.orderService.getUserDetailOrders(adminUserId, id);
        }
      } else if (user.role === ROLES[1]) {
        const storeId = user.store.id;
        getDetailOrder = await this.orderService.getOwnerDetailOrders(storeId, id); // owner
      } else if (user.role === ROLES[2]) {
        const userId = user.id;
        getDetailOrder = await this.orderService.getUserDetailOrders(userId, id); // user
      }

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

      // 이 부분은 역할인증미들웨어로 라우터에서 걸러주면 됩니다.
      if (user.role !== ROLES[0] && user.role !== ROLES[1]) {
        res.status(HTTP_STATUS.FORBIDDEN).json({
          status: HTTP_STATUS.FORBIDDEN,
          message: MESSAGES.AUTH.COMMON.ROLE.NO_ACCESS_RIGHT,
        });
      }

      const statusUpdateOrder = await this.orderService.statusUpdateOrder(user, id, status);

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
