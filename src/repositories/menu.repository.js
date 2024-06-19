class MenuRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }


  createMenu = async (
      storeId,
      name,
      price,
      image,
      description
  ) => {
    const createMenu = await this.prisma.menu.create({
      data: {
        storeId,
        name,
        price,
        image,
        description,

      },
    });
    return createMenu;
  };

  // 메뉴 목록 조회
  getMenu = async ( storeId ) => {
    let data = await this.prisma.menu.findMany({
      where: { id: +storeId }
    })


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

  // 메뉴 상세 조회
  getMenuByMenuId = async (menuId) => {
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    return menu;
  };

  // 메뉴 수정

  updateMenu = async ( 
    menuId, 
    name,
    price,
    image,
    description
    ) => {
    const updateMenu = await this.prisma.menu.update({
      where: { id : +menuId },
      data: {
          ...(name && { name }),
          ...(price && { price }),
          ...(image && { image }),
          ...(description && { description }),
      }
    })
    return updateMenu
  }

  // 메뉴 삭제
  deleteMenu = async ( menuId) => {
    const deleteMenu = await this.prisma.menu.delete({
      where: { id: +menuId },
    })


    return deleteMenu;
  };


  updateRating = async ( menuId, averageRating, totalReviews ) => {

    const updateRating = await this.prisma.menu.update({
      where: { id: menuId },
      data: {
        ...(averageRating && { averageRating }),
        ...(totalReviews && { totalReviews }),
      },
    });
    return { data: updateRating.averageRating };
  };
}

export default MenuRepository;
