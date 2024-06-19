import express from 'express';
import { verifyAccessToken } from '../utils/auth.util.js';
import { storeController } from '../di/dependency-injected-instances.js';

const storeRouter = express.Router();

// 가게 등록 API
storeRouter.post('/', verifyAccessToken, storeController.createStore())

// 가게 목록 조회 API
storeRouter.get('/', storeController.getStore())

// 가게 상세 조회 API
storeRouter.get('/:storeId', storeController.getStoreOne())

// 가게 정보 수정 API
storeRouter.patch('/:storeId', verifyAccessToken, storeController.updateStore())

// 가게 정보 삭제 API
storeRouter.delete('/:storeId', verifyAccessToken, storeController.deleteStore())

export { storeRouter };
