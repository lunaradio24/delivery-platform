import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { CartService } from '../services/cart.service.js';
import { CartController } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

const cartRepository = new CartRepository(prisma);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

// 장바구니에 담기 API

// 장바구니 조회 API

// 장바구니 수정 API

// 장바구니에서 삭제 API

export { cartRouter };
