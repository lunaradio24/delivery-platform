import express from 'express';
import { orderController } from '../di/dependency-injected-instances.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { createOrderValidator } from '../middlewares/validators/create-order-validator.middleware.js';

const orderRouter = express.Router();

// 주문 요청 API
orderRouter.post('/', createOrderValidator, requireRoles(['CUSTOMER']), orderController.createOrder);

// 주문 취소 API
orderRouter.patch('/:orderId/cancel', requireRoles(['CUSTOMER']), orderController.cancelOrder); // update joi 미들웨어 필요

// 주문 내역 목록 조회 API
orderRouter.get('/', orderController.getOrderList);

// 주문 내역 상세 조회 API
orderRouter.get('/:orderId', orderController.getOrderDetail);

// 주문 상태 변경 API
orderRouter.patch('/:orderId/status', requireRoles(['OWNER']), orderController.statusUpdateOrder);

export { orderRouter };
