import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class MenuController {
  constructor(menuService) {
    this.menuService = menuService;
  }

  createMenu = async (req, res, next) => {
    try {
      const storeId = req.params;
      const { name, price, image, description } = req.body;

      const createMenu = await this.menuService.createMenu(storeId, name, price, image, description);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        createMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  getMenu = async (req, res, next) => {
    try {
      const storeId = req.params;
      const getMenu = await this.menuRepository.getMenu(storeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        getMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  updateMenu = async (req, res, next) => {
    try {
      const menuId = req.params;
      const data = req.body;
      const updateMenu = await this.menuService.updateMenu(menuId, data);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        updateMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMenu = async (req, res, next) => {
    try {
      const menuId = req.params;
      const user = req.user;
      const ownerId = user.id;

      const deleteMenu = await this.menuService.deleteMenu(menuId, ownerId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES,
        deleteMenu,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MenuController;
