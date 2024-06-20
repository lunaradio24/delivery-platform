import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class MenuController {
  constructor(menuService, menuRepository) {
    this.menuService = menuService;
    this.menuRepository = menuRepository
  }

  createMenu = async (req, res, next) => {
    try {
      const store = req.params;
      const storeId = parseInt(store.storeId)
      const { name, price, image, description } = req.body;

      const createMenu = await this.menuService.createMenu(
        storeId,
        name,
        price,
        image,
        description
      );

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.MENUS.CREATE.SUCCEED,
        createMenu,
      });
    } catch (error) {
      next(error);
    }
  };

  getMenu = async (req, res, next) => {
    try {
      const store = req.params;
      const storeId = parseInt(store.storeId)
      const getMenu = await this.menuRepository.getMenu(storeId);

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
      const menu = req.params;
      const menuId = menu.menuId
      const {
        name,
        price,
        image,
        description
      } = req.body;
      const updateMenu = await this.menuService.updateMenu(
        menuId,
        name,
        price,
        image,
        description);

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
      const menu = req.params;
      const menuId = menu.menuId
      console.log(menuId)

      const deleteMenu = await this.menuService.deleteMenu(menuId);

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
