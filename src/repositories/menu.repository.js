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
    let data = await prisma.menu.findMany({
      where: { id: +storeId }
    })

    data = data.map((menu) =>{
      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        image: menu.image,
        totalReviews: menu.totalReviews,
        averageRating: menu.averageRating,
    }
      
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
      where: { id: +menuId }
    })

    return deleteMenu;
  }

  updateRating = async ( menuId, averageRating, totalReviews ) => {
    const updateRating = await prisma.menu.update({
      where: { id: menuId },
      data: {
        ...( averageRating && { averageRating }),
        ...( totalReviews && { totalReviews })
      }
    })
    return { data: updateRating.averageRating }
    }
  }




