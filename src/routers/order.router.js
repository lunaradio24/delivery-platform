import express from 'express';
import { orderController } from '../di/dependency-injected-instances.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { createOrderValidator } from '../middlewares/validators/create-order-validator.middleware.js';

const orderRouter = express.Router();

// 주문 요청 API

// 주문 취소 API

// 주문 내역 목록 조회 API

// 주문 내역 상세 조회 API

// 주문 상태 변경 API

export { orderRouter };
