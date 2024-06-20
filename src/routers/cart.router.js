import express from 'express';
import { cartController } from '../di/dependency-injected-instances.js';

const cartRouter = express.Router();

// 장바구니에 담기 API
cartRouter.post('/my', cartController.addCartItem);

// 장바구니 조회 API
cartRouter.get('/my', cartController.readMyCart);

// 장바구니 수정 API
cartRouter.patch('/my', cartController.updateCartItem);

// 장바구니에서 삭제 API
cartRouter.delete('/my', cartController.deleteCartItem);

export { cartRouter };
