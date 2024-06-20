import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class LikeController {
  constructor(likeService) {
    this.likeService = likeService;
  }

  likeOrUnlike = async (req, res, next) => {
    try {
      const { id: customerId } = req.user;
      const { storeId, isLike } = req.body;
      const updatedTotalLikes = await this.likeService.likeOrUnlike(customerId, storeId, isLike);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: isLike ? MESSAGES.LIKES.LIKE.SUCCEED : MESSAGES.LIKES.UNLIKE.SUCCEED,
        data: updatedTotalLikes,
      });
    } catch (error) {
      next(error);
    }
  };

  readLikedStores = async (req, res, next) => {
    try {
      const { id: customerId } = req.user;
      const likedStores = await this.likeService.readLikedStores(customerId);

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
