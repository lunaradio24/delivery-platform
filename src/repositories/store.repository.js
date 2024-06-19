import { prisma } from '../utils/prisma.util.js'


export class StoreRepository {

  // 음식점 생성
  createStore = async (
    category,
    name,
    image,
    address,
    contactNumber,
    description,
    openingHours
  ) => {
    const createStore = await prisma.store.create({
      data: {
        category,
        name,
        image,
        address,
        contactNumber,
        description,
        openingHours
      }
    })
    return createStore;
  }
  // 음식점 목록 조회
  getStore = async ( categoryIndex ) => {
    const data = await prisma.store.findMany({
      where: { category: categoryIndex },
    })
    return data
  }

  // 음식점 상세 조회
  getStoreOne = async ( storeId ) => {
    let data = await prisma.store.findUnique({
      where: { id: storeId },
    })

    data = data.map((stores) => {
      return {
        id: stores.id,
        name : stores.name,
        category : stores.category,
        image : stores.image,
        address : stores.address,
        contactNumber : stores.contactNumber,
        description : stores.description,
        openingHours : stores.openingHours,
        totalReview : stores.totalReview,
        totalLikes : stores.totalLikes,
        averageRating : stores.averageRatings,
      }
      
    })
    return data
  }

  // 음식점 수정
  updateStore = async (
    storeId,
    category,
    name,
    image,
    address,
    contactNumber,
    description,
    openingHours,
    ) => {
    const updateStore = await prisma.store.update(
      { where: {id: storeId},
        data: {
          ...(category && { category }),
          ...(name && { name }),
          ...(image && { image }),
          ...(address && { address }),
          ...(contactNumber && { contactNumber }),
          ...(description && { description }),
          ...(openingHours && { openingHours }),
        }
    })
    return updateStore;
  }

  // 음식점 삭제
  deleteStore = async ( storeId ) => {
    const deleteStore = await prisma.store.delete({
      where: { id: storeId }
    })

    return deleteStore;
  }

  // 수신한 rating, totalReviews 만 업데이트
  updateRating = async ( storeId, averageRating, totalReviews) => {
    const updateRating = await prisma.store.update({
      where: { id: storeId },
      data: {
        ...( averageRating && { averageRating }),
        ...( totalReviews && { totalReviews })
      }
    })
    return { data: updateRating.averageRating }
  }
  
}
