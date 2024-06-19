import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { storeController } from '../di/dependency-injected-instances.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const storeRouter = express.Router();

// 가게 등록 API
storeRouter.post('/', requireAccessToken, requireRoles(['OWNER']), storeController.createStore);

// 가게 목록 조회 API
storeRouter.get('/', storeController.getStore);

// 가게 상세 조회 API
storeRouter.get('/:storeId', storeController.getStoreOne);

// 가게 정보 수정 API
storeRouter.patch('/:storeId', requireAccessToken, requireRoles(['OWNER']), storeController.updateStore);

// 가게 정보 삭제 API
storeRouter.delete('/:storeId', requireAccessToken, requireRoles(['OWNER']), storeController.deleteStore);

export { storeRouter };
