import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class LikeService {
  constructor(likeRepository, storeRepository) {
    this.likeRepository = likeRepository;
    this.storeRepository = storeRepository;
  }

  likeOrUnlike = async (customerId, storeId, isLike) => {
    // 존재하는 가게인지 확인
    const existingStore = await this.storeRepository.findByStoreId(storeId);
    if (!existingStore) throw new HttpError.NotFound(MESSAGES.STORES.COMMON.NOT_FOUND);

    // 이미 찜 목록에 있는지 확인
    const likedStore = await this.likeRepository.findLikedStoreByUserIdAndStoreId(customerId, storeId);
    // 찜하기를 눌렀는데 이미 찜 목록에 있다면 에러
    if (isLike && likedStore) throw new HttpError.Conflict(MESSAGES.LIKES.LIKE.DUPLICATED);
    // 찜하기 취소를 눌렀는데 이미 찜 목록에 없다면 에러
    if (!isLike && !likedStore) throw new HttpError.Conflict(MESSAGES.LIKES.UNLIKE.DUPLICATED);

    // Transaction 생성
    const updatedTotalLikes = this.likeRepository.createTransaction(async (tx) => {
      // 찜하기 - 가게를 찜 목록에 추가
      if (isLike) await this.likeRepository.like(customerId, storeId, { tx });
      // 찜하기 취소 - 가게를 찜 목록에서 제거
      else await this.likeRepository.unlike(customerId, storeId, { tx });
      // 공통 - 가게 total_likes 수정
      return await this.storeRepository.updateTotalLikes(storeId, isLike, { tx });
    });
    return updatedTotalLikes;
  };

  readLikedStores = async (customerId) => {
    const likedStores = await this.likeRepository.findLikedStoresByUserId(customerId);
    return likedStores;
  };
}

export default LikeService;
