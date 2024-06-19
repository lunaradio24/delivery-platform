import express from 'express';
import { cartController } from '../di/dependency-injected-instances.js';

const cartRouter = express.Router();

// 장바구니에 담기 API
cartRouter.post('/carts', cartController.createCart);

// 장바구니 조회 API
cartRouter.get('/users/me/carts/:cartId', cartController.readCart);

// 장바구니 수정 API
cartRouter.patch('/users/me/carts/:cartId', cartController.updateCart);

// 장바구니에서 삭제 API
cartRouter.delete('/users/me/carts/:cartId', cartController.deleteCart);

export { cartRouter };
