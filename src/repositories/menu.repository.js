class MenuRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createMenu = async (storeId, name, price, image, description) => {
    const createMenu = await this.prisma.menu.create({
      data: { storeId, name, price, image, description },
    });
    return createMenu;
  };

  // 메뉴 목록 조회
  findAllMenusByStoreId = async (storeId) => {
    let data = await this.prisma.menu.findMany({
      where: { storeId },
    });

    data = data.map((menu) => {
      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        image: menu.image,
        totalReviews: menu.totalReviews,
        averageRating: menu.averageRating,
      };
    });

    return data;
  };

  // 메뉴 아이디 여러개로 메뉴 목록 조회
  findMenusByMenuIds = async (menuIds, { tx } = {}) => {
    const orm = tx || this.prisma;
    const menus = await orm.menu.findMany({
      where: {
        id: { in: menuIds },
      },
    });
    return menus;
  };

  // 메뉴 상세 조회
  findMenuByMenuId = async (menuId, { tx } = {}) => {
    const orm = tx || this.prisma;
    const menu = await orm.menu.findUnique({
      where: { id: Number(menuId) },
    });
    return menu;
  };

  findMenuByName = async (storeId, name) => {
    const menu = await this.prisma.menu.findFirst({
      where: { storeId, name },
    });
    return menu;
  };

  // 메뉴 수정
  updateMenu = async (menuId, name, price, image, description) => {
    const updateMenu = await this.prisma.menu.update({
      where: { id: Number(menuId) },
      data: { name, price, image, description },
    });
    return updateMenu;
  };

  // 메뉴 삭제
  deleteMenu = async (menuId) => {
    const deleteMenu = await this.prisma.menu.delete({
      where: { id: Number(menuId) },
    });

    return deleteMenu;
  };

  updateRating = async (menuId, averageRating, totalReviews, { tx } = {}) => {
    const orm = tx || this.prisma;
    const updatedMenu = await orm.menu.update({
      where: { id: Number(menuId) },
      data: { averageRating, totalReviews },
      select: { averageRating: true },
    });
    return updatedMenu.averageRating;
  };
}

export default MenuRepository;
