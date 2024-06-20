import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class MenuService {
  constructor(menuRepository, storeRepository) {
    this.menuRepository = menuRepository;
    this.storeRepository = storeRepository;
  }

  createMenu = async (ownerId, storeId, name, price, image, description) => {
    // 해당 가게의 사장이 맞는지 확인
    const store = await this.storeRepository.findByStoreId(storeId);
    if (!store || (store && store.ownerId !== ownerId)) {
      throw new HttpError.Forbidden(MESSAGES.STORES.COMMON.NO_ACCESS_RIGHT);
    }

    // 해당 메뉴가 이미 있는지 확인
    const menu = await this.menuRepository.findMenuByName(storeId, name);
    if (menu) throw new HttpError.Conflict(MESSAGES.MENUS.CREATE.DUPLICATED);

    const createMenu = await this.menuRepository.createMenu(storeId, name, price, image, description);

    return createMenu;
  };

  getMenuList = async (storeId) => {
    const menuList = await this.menuRepository.findMenuList(storeId);
    return menuList;
  };

  updateMenu = async (ownerId, storeId, menuId, name, image, description, price) => {
    // 해당 가게의 사장이 맞는지 확인
    const store = await this.storeRepository.findByStoreId(storeId);
    if (!store || (store && store.ownerId !== ownerId)) {
      throw new HttpError.Forbidden(MESSAGES.STORES.COMMON.NO_ACCESS_RIGHT);
    }
    // 해당 메뉴가 존재하는지 확인
    const menu = await this.menuRepository.findMenuByMenuId(menuId);
    if (!menu) throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);

    // 해당 메뉴가 그 가게 메뉴인지 확인
    if (menu.storeId !== storeId) throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);

    const updateMenu = await this.menuRepository.updateMenu(menuId, name, image, description, price);

    return updateMenu;
  };

  deleteMenu = async (ownerId, storeId, menuId) => {
    // 해당 가게의 사장이 맞는지 확인
    const store = await this.storeRepository.findByStoreId(storeId);
    if (!store || (store && store.ownerId !== ownerId)) {
      throw new HttpError.Forbidden(MESSAGES.STORES.COMMON.NO_ACCESS_RIGHT);
    }
    // 해당 메뉴가 존재하는지 확인
    const menu = await this.menuRepository.findMenuByMenuId(menuId);
    if (!menu) throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);

    // 해당 메뉴가 그 가게 메뉴인지 확인
    if (menu.storeId !== storeId) throw new HttpError.NotFound(MESSAGES.MENUS.COMMON.NOT_FOUND);

    const deleteMenu = await this.menuRepository.deleteMenu(menuId);

    return deleteMenu;
  };
}

export default MenuService;
