import BaseRepository from './base.repository.js';

class LikeRepository extends BaseRepository {
  like = async (customerId, storeId, { tx } = {}) => {
    const orm = tx || this.prisma;
    await orm.like.create({ data: { customerId, storeId } });
  };

  unlike = async (customerId, storeId, { tx } = {}) => {
    const orm = tx || this.prisma;
    await orm.like.delete({
      where: { customerId_storeId: { customerId, storeId } },
    });
  };

  findLikedStoreByUserIdAndStoreId = async (customerId, storeId) => {
    const likedStore = await this.prisma.like.findUnique({
      where: { customerId_storeId: { customerId, storeId } },
    });
    return likedStore;
  };

  findLikedStoresByUserId = async (customerId) => {
    const likedStores = await this.prisma.like.findMany({
      where: { customerId },
    });
    return likedStores;
  };
}

export default LikeRepository;
