import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class MenuService {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  createMenu = async (storeId, name, price, image, description) => {
    const createMenu = await this.menuRepository.createMenu(storeId, name, price, image, description);

    return createMenu;
  };

  updateMenu = async (menuId, name, image, description, price) => {
    const updateMenu = await this.menuRepository.updateMenu(menuId, name, image, description, price);

    return updateMenu;
  };

  deleteMenu = async (menuId) => {
    const deleteMenu = await this.menuRepository.deleteMenu(menuId);

    return deleteMenu;
  };
}

export default MenuService;
