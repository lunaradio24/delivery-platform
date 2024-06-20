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

      const createMenu = await this.menuService.createMenu(ownerId, Number(storeId), name, price, image, description);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.CREATE.SUCCEED,
        createMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  getMenuList = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const getMenu = await this.menuService.getMenuList(Number(storeId));

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.READ_LIST.SUCCEED,
        getMenu,
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
      const updateMenu = await this.menuService.updateMenu(
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
        updateMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMenu = async (req, res, next) => {
    try {
      const { id: ownerId } = req.user;
      const { storeId, menuId } = req.params;
      const deleteMenu = await this.menuService.deleteMenu(ownerId, Number(storeId), Number(menuId));

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.DELETE.SUCCEED,
        deleteMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  menuImageUpload = async (req, res, next) => {
    try {
      const imageUrl = req.file.location

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.IMAGE.SUCCEED,
        imageUrl
      })
    }catch(error){
      next(error)
    }
  }
}

export default MenuController;
