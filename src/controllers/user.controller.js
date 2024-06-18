import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserController {
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
      next (error);
    };
  };
}
