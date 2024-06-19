import express from 'express';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { storeController } from '../di/dependency-injected-instances.js';

const storeRouter = express.Router();

// 가게 등록 API
storeRouter.post('/', requireRefreshToken, storeController.createStore)

// 가게 목록 조회 API
storeRouter.get('/', storeController.getStore)

// 가게 상세 조회 API
storeRouter.get('/:storeId', storeController.getStoreOne)

// 가게 정보 수정 API
storeRouter.patch('/:storeId', requireRefreshToken, storeController.updateStore)

// 가게 정보 삭제 API
storeRouter.delete('/:storeId', requireRefreshToken, storeController.deleteStore)

export { storeRouter };
