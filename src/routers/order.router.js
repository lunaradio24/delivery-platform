import express from 'express';
import { prisma } from '../utils/prisma.util';
import { OrderRepository } from '../repositories/order.repository.js';
import { OrderService } from '../services/order.service.js';
import { OrderController } from '../controllers/order.controller.js';

const orderRouter = express.Router();

const orderRepository = new OrderRepository(prisma);
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

// 주문 완료 API

// 주문 내역 목록 조회 API

// 주문 내역 상세 조회 API

// 주문 상태 변경 API

export { orderRouter };
