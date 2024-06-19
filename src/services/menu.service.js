class MenuService {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

    createMenu = async (
      storeId,
      name,
      price,
      image,
      description
    ) => {
      const createMenu = await menuRepository.createMenu(
        storeId,
        name,
        price,
        image,
        description
      )
        
      return createMenu
    }

    updateMenu = async (
      menuId, 
      name,
      image,
      description,
      price) => {
      const updateMenu = await menuRepository.updateMenu(
          menuId,
          name,
          image,
          description,
          price
      )

      return updateMenu
    }

    deleteMenu = async (menuId, ownerId) => {
      const deleteMenu = await menuRepository.deleteMenu(menuId, ownerId)

      return deleteMenu
    }
  }

export default MenuService;

