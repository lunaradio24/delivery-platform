import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class ReviewService {
  constructor(reviewRepository, orderRepository, orderItemRepository, storeRepository, menuRepository) {
    this.reviewRepository = reviewRepository;
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.storeRepository = storeRepository;
    this.menuRepository = menuRepository;
  }

  create = async (userId, storeId, orderId, rating, content, image) => {
    // 존재하는 가게인지 확인
    const store = await this.storeRepository.findByStoreId(storeId);
    if (!store) throw new HttpError.NotFound(MESSAGES.STORES.COMMON.NOT_FOUND);

    // 존재하는 주문인지, 해당 주문이 이 가게의 주문이 맞는지 확인
    const order = await this.orderRepository.findByOrderId(orderId);
    if (!order || (order && store.id !== storeId)) {
      throw new HttpError.NotFound(MESSAGES.ORDERS.COMMON.NOT_FOUND);
    }

    // 이미 리뷰가 작성된 주문인지 확인
    const existingReview = await this.reviewRepository.findByOrderId(orderId);
    if (existingReview) throw new HttpError.Conflict(MESSAGES.REVIEWS.CREATE.DUPLICATED);

    // Transaction 생성
    await this.reviewRepository.createTransaction(async (tx) => {
      // 리뷰 생성
      const createdReview = await this.reviewRepository.create(userId, storeId, orderId, rating, content, image, {
        tx,
      });

      // 가게 평균 별점, 총 리뷰 수 수정
      const updatedTotalReviews = store.totalReviews + 1;
      const updatedStoreRating = (store.averageRating * store.totalReviews + rating) / updatedTotalReviews;
      await this.storeRepository.updateRating(storeId, updatedStoreRating, updatedTotalReviews, { tx });

      // 메뉴 평균 별점, 총 리뷰 수 수정
      const orderItemIds = await this.orderItemRepository.findMenuIdsByOrderId(orderId, { tx });
      for (const menuId of orderItemIds) {
        const menu = await this.menuRepository.findMenuByMenuId(menuId, { tx });
        const updatedTotalReviews = menu.totalReviews + 1;
        const updatedMenuRating = (menu.averageRating * menu.totalReviews + rating) / updatedTotalReviews;
        await this.menuRepository.updateRating(menuId, updatedMenuRating, updatedTotalReviews, { tx });
      }
      // Review Controller에 반환
      return createdReview;
    });
  };

  readList = async (storeId, menuId, orderBy, sort) => {
    // sort 값이 'asc'인 경우 제외하고 'desc' (내림차순) 정렬
    sort = sort && sort.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // orderBy 값이 'timestamp'인 경우 제외하고 'rating' (별점) 기준 정렬
    const orderOption = orderBy?.toLowerCase() === 'timestamp' ? { createdAt: sort } : { rating: sort };

    // Review Repository에 DB 조회 요청
    const reviews = await this.reviewRepository.findByStoreIdAndMenuId(storeId, menuId, orderOption);

    // Review Controller에 반환
    return reviews;
  };

  readListByUserId = async (userId) => {
    // Review Repository에 DB 조회 요청
    const reviews = await this.reviewRepository.findByUserId(userId);

    // Review Controller에 반환
    return reviews;
  };

  readDetail = async (reviewId) => {
    // 존재하는 리뷰인지 확인
    const review = await this.reviewRepository.findByReviewId(reviewId);
    if (!review) throw new HttpError.NotFound(MESSAGES.REVIEWS.COMMON.NOT_FOUND);

    // Review Controller에 반환
    return review;
  };

  update = async (userId, reviewId, rating, content, image) => {
    // 존재하는 리뷰인지 확인
    const review = await this.reviewRepository.findByReviewId(reviewId);
    if (!review) throw new HttpError.NotFound(MESSAGES.REVIEWS.COMMON.NOT_FOUND);

    // 리뷰 작성자인지 확인
    if (userId !== review.customerId) throw new HttpError.Forbidden(MESSAGES.REVIEWS.COMMON.NO_ACCESS_RIGHT);

    // Transaction 생성
    const tx = await this.reviewRepository.createTransaction();

    // 리뷰 수정
    const oldRating = review.rating;
    const updatedReview = await this.reviewRepository.update(reviewId, rating, content, image, { tx });

    // 별점이 수정되었다면
    if (rating && rating !== oldRating) {
      const newRating = rating;
      // 가게 평균 별점 수정
      const updatedStoreRating =
        (review.store.averageRating * review.store.totalReviews - oldRating + newRating) / review.store.totalReviews;
      await this.storeRepository.updateRating(review.storeId, updatedStoreRating, { tx });

      // 메뉴 평균 별점 수정
      const orderItemIds = await this.orderItemRepository.findMenuIdsByOrderId(review.orderId, { tx });
      for (const menuId of orderItemIds) {
        const menu = await this.menuRepository.findMenuByMenuId(menuId);
        const updatedMenuRating = (menu.averageRating * menu.totalReviews + rating) / (menu.totalReviews + 1);
        await this.menuRepository.updateRating(menuId, updatedMenuRating, { tx });
      }
    }

    // Review Controller에 반환
    return updatedReview;
  };

  delete = async (userId, reviewId) => {
    // 존재하는 리뷰인지 확인
    const review = await this.reviewRepository.findByReviewId(reviewId);
    if (!review) throw new HttpError.NotFound(MESSAGES.REVIEWS.COMMON.NOT_FOUND);

    // 리뷰 작성자인지 확인
    if (userId !== review.customerId) throw new HttpError.Forbidden(MESSAGES.REVIEWS.COMMON.NO_ACCESS_RIGHT);

    // Transaction 생성
    const tx = await this.reviewRepository.createTransaction();

    // 리뷰 삭제
    await this.reviewRepository.delete(reviewId, { tx });

    // 가게 평균 별점 수정, 총 리뷰 수 수정
    const oldRating = review.rating;
    const updatedTotalReviews = review.store.totalReviews - 1;
    const updatedStoreRating =
      (review.store.averageRating * review.store.totalReviews - oldRating) / updatedTotalReviews;
    await this.storeRepository.updateRating(review.storeId, updatedStoreRating, updatedTotalReviews, { tx });

    // 메뉴 평균 별점, 총 리뷰 수 수정
    const orderItemIds = await this.orderItemRepository.findMenuIdsByOrderId(review.orderId, { tx });
    for (const menuId of orderItemIds) {
      const menu = await this.menuRepository.findMenuByMenuId(menuId);
      const updatedTotalReviews = menu.totalReviews - 1;
      const updatedMenuRating = (menu.averageRating * menu.totalReviews - oldRating) / updatedTotalReviews;
      await this.menuRepository.updateRating(menuId, updatedMenuRating, updatedTotalReviews, { tx });
    }
  };
}

export default ReviewService;
