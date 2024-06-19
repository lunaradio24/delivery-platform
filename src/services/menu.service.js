import { MenuRepository } from '../repositories/menu.repository.js';

const menuRepository = new MenuRepository()

export class MenuService {
    createMenu = async () => {
      const createMenu = await menuRepository.createMenu()

      return createMenu
    }

    updateMenu = async () => {
      const updateMenu = await menuRepository.updateMenu()

      return updateMenu
    }

    deleteMenu = async () => {
      const deleteMenu = await menuRepository.deleteMenu()

      return deleteMenu
    }
  }



