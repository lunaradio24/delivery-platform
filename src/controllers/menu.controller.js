import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class MenuController {
  constructor(menuService) {
    this.menuService = menuService;
  }

  createMenu = async (req, res, next) => {
    try {
      const { id: ownerId } = req.user;
      const { storeId } = req.params;
      const { name, price, image, description } = req.body;

      const createdMenu = await this.menuService.createMenu(ownerId, Number(storeId), name, price, image, description);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.CREATE.SUCCEED,
        data: createdMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  getMenuList = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const menus = await this.menuService.getMenuList(Number(storeId));

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.READ_LIST.SUCCEED,
        data: menus,
      });
    } catch (error) {
      next(error);
    }
  };

  updateMenu = async (req, res, next) => {
    try {
      const { id: ownerId } = req.user;
      const { storeId, menuId } = req.params;
      const { name, price, image, description } = req.body;
      const updatedMenu = await this.menuService.updateMenu(
        ownerId,
        Number(storeId),
        Number(menuId),
        name,
        price,
        image,
        description,
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.UPDATE.SUCCEED,
        data: updatedMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMenu = async (req, res, next) => {
    try {
      const { id: ownerId } = req.user;
      const { storeId, menuId } = req.params;
      const deletedMenu = await this.menuService.deleteMenu(ownerId, Number(storeId), Number(menuId));

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.DELETE.SUCCEED,
        data: deletedMenu,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MenuController;
