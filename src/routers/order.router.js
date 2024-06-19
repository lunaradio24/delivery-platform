import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { OrderService } from '../services/order.service.js';
import { OrderController } from '../controllers/order.controller.js';
import { requireRoles } from '../middlewares/requirer-roles.middleware.js';
import { createOrderValidator } from '../middlewares/validators/create-order-validator.middleware.js';
const orderRouter = express.Router();

const orderRepository = new OrderRepository(prisma);
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

// 주문 요청 API
orderRouter.post('/orders', createOrderValidator, orderController.createOrder); // create joi 미들웨어 필요

// 주문 취소 API
orderRouter.patch('/orders/:orderId', orderController.cancelOrder); // update joi 미들웨어 필요

// 주문 내역 목록 조회 API
orderRouter.get('/orders', orderController.getOrders);

// 주문 내역 상세 조회 API
orderRouter.get('/orders/:orderId', orderController.getDetailOrder);

// 주문 상태 변경 API
orderRouter.patch('/orders/:orderId/status', requireRoles(['OWNER']), orderController.statusUpdateOrder); //update joi 미들웨어 필요

export { orderRouter };
