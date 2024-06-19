import express from 'express';
import { verifyAccessToken } from '../utils/auth.util.js';
import { menuController } from '../di/dependency-injected-instances.js';

const menuRouter = express.Router();

// 메뉴 생성 API
menuRouter.post('/', menuController.createMenu)

// 메뉴 목록 조회 API
menuRouter.get('/', menuController.getMenu)

// 메뉴 수정 API
menuRouter.patch('/:menuId', verifyAccessToken, menuController.updateMenu)

// 메뉴 삭제 API
menuRouter.delete('/:menuId', verifyAccessToken, menuController.deleteMenu)

export { menuRouter };
