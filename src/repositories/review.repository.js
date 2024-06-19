import { BaseRepository } from './base.repository.js';

export class ReviewRepository extends BaseRepository {
  create = async (userId, storeId, orderId, rating, content, image, { tx }) => {
    const orm = tx || this.prisma;
    const createdReview = await orm.review.create({
      data: { customerId: userId, storeId, orderId, rating, content, image },
    });

    return createdReview;
  };

  findByStoreIdAndMenuId = async (storeId, menuId, orderOption) => {
    await this.prisma.review.findMany({
      where: { storeId, menuId },
      orderBy: orderOption,
    });
  };

  findByReviewId = async (reviewId) => {
    await this.prisma.review.findUnique({ where: { id: reviewId } });
  };

  findByOrderId = async (orderId) => {
    await this.prisma.review.findUnique({ where: { orderId } });
  };

  findByUserId = async (userId) => {
    await this.prisma.review.findMany({ where: { customerId: userId } });
  };

  update = async (reviewId, rating, content, image, { tx }) => {
    const orm = tx || this.prisma;
    const updatedReview = await orm.review.update({
      where: { id: reviewId },
      data: { rating, content, image },
    });

    return updatedReview;
  };

  delete = async (reviewId, { tx }) => {
    const orm = tx || this.prisma;
    await orm.review.delete({ where: { id: reviewId } });
  };
}
