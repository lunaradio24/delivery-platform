class StoreRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 음식점 생성
  createStore = async (
        ownerId,
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
        ownerId,
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
  getStore = async ( categoryId ) => {
    let data = await prisma.store.findMany({
      where: { category: +categoryId }
  })

    data = data.map((store) => {
        return {
          id: store.id,
          name : store.name,
          category : store.category,
          image : store.image,
          address : store.address,
          contactNumber : store.contactNumber,
          description : store.description,
          openingHours : store.openingHours,
          totalReview : store.totalReviews,
          totalLikes : store.totalLikes,
          averageRating : store.averageRating,
        }
    })
    return data
  }

  // 음식점 상세 조회
  getStoreOne = async ( storeId ) => {
    let data = await prisma.store.findUnique({
      where: { id: +storeId } })
    
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
      where: { id: +storeId }
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

export default StoreRepository;

