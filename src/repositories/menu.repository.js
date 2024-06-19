import { prisma } from '../utils/prisma.util.js'

export class MenuRepository {

  createMenu = async ({
    name,
    price,
    image,
    description
  }) => {
    const createMenu = await prisma.menu.create({
      data: {
        name,
        price,
        image,
        description
      }
    })
    return createMenu;
  }
  // 메뉴 목록 조회
  getMenu = async ( storeId ) => {
    const data = await prisma.menu.findMany({
      where: { id: storeId },
    })
    return data
  }


  // 메뉴 수정
  updateMenu = async ( menuId ) => {
    const updateMenu = await prisma.menu.update({
      where: { id : menuId },
      data: {

      }
    })
    return updateMenu
  }

  // 메뉴 삭제
  deleteMenu = async ( menuId ) => {
    const deleteMenu = await prisma.menu.delete({
      where: { id: menuId }
    })

    return deleteMenu;
  }

  updateRating = async ( menuId, rating ) => {
    const updateRating = await prisma.menu.update({
      
    })
  }
}



