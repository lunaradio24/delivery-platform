import express from 'express';
import { storeController } from '../di/dependency-injected-instances.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const storeRouter = express.Router();

// 가게 등록 API
storeRouter.post('/', requireRoles(['OWNER']), requireAccessToken, storeController.createStore)

// 가게 목록 조회 API
storeRouter.get('/', storeController.getStore)

// 가게 상세 조회 API
storeRouter.get('/:storeId', storeController.getStoreOne)

// 가게 정보 수정 API
storeRouter.patch('/:storeId', requireRoles(['OWNER']), requireAccessToken, storeController.updateStore)

// 가게 정보 삭제 API
storeRouter.delete('/:storeId',requireRoles(['OWNER']), requireAccessToken, storeController.deleteStore)

export { storeRouter };
