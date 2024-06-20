import BaseRepository from './base.repository.js';

class ReviewRepository extends BaseRepository {
  create = async (userId, storeId, orderId, rating, content, image, { tx } = {}) => {
    const orm = tx || this.prisma;
    const createdReview = await orm.review.create({
      data: {
        customerId: userId,
        storeId: Number(storeId),
        orderId: Number(orderId),
        rating: Number(rating),
        content,
        image,
      },
    });

    return createdReview;
  };

  findByStoreIdAndMenuId = async (storeId, menuId, orderOption) => {
    return await this.prisma.review.findMany({
      where: {
        storeId: Number(storeId),
        menuId: menuId ? Number(menuId) : undefined,
      },
      orderBy: orderOption,
    });
  };

  findByReviewId = async (reviewId) => {
    return await this.prisma.review.findUnique({
      where: { id: Number(reviewId) },
      include: {
        store: {
          select: { name: true, image: true, averageRating: true, totalReviews: true },
        },
      },
    });
  };

  findByOrderId = async (orderId) => {
    return await this.prisma.review.findUnique({ where: { orderId: Number(orderId) } });
  };

  findByUserId = async (userId) => {
    return await this.prisma.review.findMany({ where: { customerId: userId } });
  };

  update = async (reviewId, rating, content, image, { tx } = {}) => {
    const orm = tx || this.prisma;
    const updatedReview = await orm.review.update({
      where: { id: Number(reviewId) },
      data: { rating, content, image },
      select: {
        rating: rating ? true : false,
        content: content ? true : false,
        image: image ? true : false,
      },
    });
    return updatedReview;
  };

  delete = async (reviewId, { tx } = {}) => {
    const orm = tx || this.prisma;
    await orm.review.delete({ where: { id: Number(reviewId) } });
  };
}

export default ReviewRepository;
