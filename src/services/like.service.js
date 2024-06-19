import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class LikeService {
  constructor(likeRepository) {
    this.likeRepository = likeRepository;
  }

  likeOrUnlike = async (userId, storeId, isLike) => {
    // Transaction 생성
    const tx = this.likeRepository.createTransaction();

    // 이미 찜 목록에 있는지 확인
    const likedStore = await this.likeRepository.findLikedStoreByUserIdAndStoreId(userId, storeId);

    // isLike가 true이면 찜하기
    if (isLike) {
      // 이미 찜 목록에 있다면 에러
      if (likedStore) throw new HttpError.Conflict(MESSAGES.LIKES.LIKE.DUPLICATED);
      // 찜 목록에 추가
      await this.likeRepository.like(storeId, { tx });
      // 가게 total_likes 수정
      await this.storeRepository.updateTotalLikes(storeId, 1, { tx });
    }
    // isLike가 false면 찜하기 취소
    else {
      // 이미 찜 목록에 없다면 에러
      if (!likedStore) throw new HttpError.Conflict(MESSAGES.LIKES.UNLIKE.DUPLICATED);
      // 찜 목록에서 제거
      await this.likeRepository.unlike(storeId, { tx });
      // 가게 total_likes 수정
      await this.storeRepository.updateTotalLikes(storeId, -1, { tx });
    }
  };

  readLikedStores = async (userId) => {
    const likedStores = await this.likeRepository.findLikedStoresByUserId(userId);
    return likedStores;
  };
}

export default LikeService;
