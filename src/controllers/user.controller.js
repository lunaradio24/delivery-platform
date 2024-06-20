import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  /** 프로필 조회 */
  getMyInfo = async (req, res, next) => {
    try {
      // userId 가져오기
      const userId = req.user.id;
      const profile = await this.userService.getMyInfo(userId);

      // 성공 메세지 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.READ_ME.SUCCEED,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  /** 프로필 수정 */
  patchMyInfo = async (req, res, next) => {
    try {
      // userId 가져오기
      const userId = req.user.id;
      const { nickname, address, image, contactNumber } = req.body;
      const updatedProfile = await this.userService.updateMyInfo(userId, nickname, address, image, contactNumber);

      // 성공 메세지 반환
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.UPDATE_ME.SUCCEED,
        data: updatedProfile,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  userImageUpload = async (req, res, next) => {
    try {
      const imageUrl = req.file.location
      const userId = req.user.id

      const userImageUpload = await this.userService.userImageUpload(imageUrl, userId)

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.USERS.IMAGE_ME.SUCCEED,
        imageUrl
      })
    }catch(error){
      next(error)
    }
  }
}

export default UserController;
