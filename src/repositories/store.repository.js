class StoreRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 음식점 생성
  createStore = async (ownerId, category, name, image, address, contactNumber, description, openingHours) => {
    const createdStore = await this.prisma.store.create({
      data: {
        ownerId,
        category,
        name,
        image,
        address,
        contactNumber,
        description,
        openingHours,
      },
    });
    return createdStore;
  };

  // 음식점 조회 by 사장 id
  findByOwnerId = async (ownerId) => {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: Number(ownerId) },
    });
    return store;
  };

  // 음식점 목록 조회
  findStoreList = async (category, orderOption) => {
    let data = await this.prisma.store.findMany({
      where: { category },
      orderBy: orderOption,
    });

    data = data.map((store) => {
      return {
        id: store.id,
        name: store.name,
        category: store.category,
        image: store.image,
        address: store.address,
        contactNumber: store.contactNumber,
        description: store.description,
        openingHours: store.openingHours,
        totalReview: store.totalReviews,
        totalLikes: store.totalLikes,
        averageRating: store.averageRating,
      };
    });
    return data;
  };

  // 음식점 상세 조회
  findByStoreId = async (storeId) => {
    const store = await this.prisma.store.findUnique({
      where: { id: Number(storeId) },
    });
    return store;
  };

  // 음식점 수정
  updateStore = async (storeId, category, name, image, address, contactNumber, description, openingHours) => {
    const updatedStore = await this.prisma.store.update({
      where: { id: Number(storeId) },
      data: { category, name, image, address, contactNumber, description, openingHours },
    });
    return updatedStore;
  };

  // 음식점 삭제
  deleteStore = async (storeId) => {
    const deleteStore = await this.prisma.store.delete({
      where: { id: Number(storeId) },
    });

    return deleteStore;
  };

  // 수신한 rating, totalReviews 만 업데이트
  updateRating = async (storeId, updatedRating, updatedTotalReviews, { tx } = {}) => {
    const orm = tx || this.prisma;
    const updatedStore = await orm.store.update({
      where: { id: storeId },
      data: {
        averageRating: updatedRating,
        totalReviews: updatedTotalReviews,
      },
      select: { averageRating: true },
    });
    return updatedStore.averageRating;
  };

  updateTotalLikes = async (storeId, isLike, { tx } = {}) => {
    const updateLikes = isLike ? { increment: 1 } : { decrement: 1 };
    const orm = tx || this.prisma;
    const updatedStore = await orm.store.update({
      where: { id: storeId },
      data: { totalLikes: updateLikes },
      select: { totalLikes: true },
    });
    return updatedStore.totalLikes;
  };

  storeAddWallet = async (ownerId, totalPrice, { tx } = {}) => {
    const orm = tx || this.prisma;
    const addWallet = await orm.store.update({
      where: { ownerId: ownerId },
      data: { totalSales: { increment: totalPrice } },
    });
    return addWallet;
  };
}
export default StoreRepository;
