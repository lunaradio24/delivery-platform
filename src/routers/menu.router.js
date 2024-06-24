import express from 'express';
import { menuController } from '../di/dependency-injected-instances.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';

const menuRouter = express.Router({ mergeParams: true });

// 메뉴 생성 API
menuRouter.post('/', requireAccessToken, requireRoles(['BUSINESS']), menuController.createMenu);

// 메뉴 목록 조회 API
menuRouter.get('/', menuController.getMenuList);

// 메뉴 수정 API
menuRouter.patch('/:menuId', requireAccessToken, requireRoles(['BUSINESS']), menuController.updateMenu);

// 메뉴 삭제 API
menuRouter.delete('/:menuId', requireAccessToken, requireRoles(['BUSINESS']), menuController.deleteMenu);

export { menuRouter };
