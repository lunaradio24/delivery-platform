import express from 'express';
import { menuController } from '../di/dependency-injected-instances.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';

const menuRouter = express.Router();

// 메뉴 생성 API
menuRouter.post('/', requireRoles(['OWNER']), requireRefreshToken, menuController.createMenu)

// 메뉴 목록 조회 API
menuRouter.get('/', menuController.getMenu)

// 메뉴 수정 API
menuRouter.patch('/:menuId', requireRoles(['OWNER']), requireRefreshToken, menuController.updateMenu)

// 메뉴 삭제 API
menuRouter.delete('/:menuId', requireRoles(['OWNER']), requireRefreshToken, menuController.deleteMenu)

export { menuRouter };
