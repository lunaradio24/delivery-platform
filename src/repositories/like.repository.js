import { BaseRepository } from './base.repository.js';

export class LikeRepository extends BaseRepository {
  like = async (storeId, { tx }) => {
    const orm = tx || this.prisma;
    await orm.like.create({ data: { storeId } });
  };

  unlike = async (storeId, { tx }) => {
    const orm = tx || this.prisma;
    await orm.like.delete({ where: { storeId } });
  };

  findLikedStoreByUserIdAndStoreId = async (userId, storeId) => {
    const likedStore = await this.prisma.like.findUnique({
      where: { customerId: userId, storeId },
    });
    return likedStore;
  };

  findLikedStoresByUserId = async (userId) => {
    const likedStores = await this.prisma.like.findMany({
      where: { customerId: userId },
    });
    return likedStores;
  };
}
