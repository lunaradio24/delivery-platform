import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class LikeController {
  constructor(likeService) {
    this.likeService = likeService;
  }

  likeOrUnlike = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { storeId, isLike } = req.body;
      await likeService.likeOrUnlike(userId, storeId, isLike);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: isLike ? MESSAGES.LIKES.LIKE.SUCCEED : MESSAGES.LIKES.UNLIKE.SUCCEED,
      });
    } catch (error) {
      next(error);
    }
  };

  readLikedStores = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const likedStores = await likeService.readLikedStores(userId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.LIKES.READ_LIST.SUCCEED,
        data: likedStores,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default LikeController;
