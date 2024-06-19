import express from 'express';
import { cartController } from '../di/dependency-injected-instances.js';

const cartRouter = express.Router();

// 장바구니에 담기 API
cartRouter.post('/', cartController.createCart);

// 장바구니 조회 API
cartRouter.get('/:cartId', cartController.readCart);

// 장바구니 수정 API
cartRouter.patch('/:cartId', cartController.updateCart);

// 장바구니에서 삭제 API
cartRouter.delete('/:cartId', cartController.deleteCart);

export { cartRouter };
