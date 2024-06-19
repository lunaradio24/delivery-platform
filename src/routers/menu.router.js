import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { MenuRepository } from '../repositories/menu.repository.js';
import { MenuService } from '../services/menu.service.js';
import { MenuController } from '../controllers/menu.controller.js';
import { verifyAccessToken } from '../utils/auth.util.js';

const menuRouter = express.Router();

const menuRepository = new MenuRepository(prisma);
const menuService = new MenuService(menuRepository);
const menuController = new MenuController(menuService);

// 메뉴 생성 API
menuRouter.post('/', menuController.createMenu)

// 메뉴 목록 조회 API
menuRouter.get('/', menuController.getMenu)

// 메뉴 수정 API
menuRouter.patch('/:menuId', verifyAccessToken, menuController.updateMenu)

// 메뉴 삭제 API
menuRouter.delete('/:menuId', verifyAccessToken, menuController.deleteMenu)

export { menuRouter };
