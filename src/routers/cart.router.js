import express from 'express';
import { cartController } from '../di/dependency-injected-instances.js';

const cartRouter = express.Router();

// 장바구니에 담기 API
cartRouter.post('/my', cartController.createCart);

// 장바구니 조회 API
cartRouter.get('/my', cartController.readCart);

// 장바구니 아이템 수정 API
cartRouter.patch('/my', cartController.updateCart);

// 장바구니 아이템 삭제 API
cartRouter.delete('/my', cartController.deleteCart);

export { cartRouter };
