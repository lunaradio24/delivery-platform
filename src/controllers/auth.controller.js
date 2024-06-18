import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { AuthService } from '../services/auth.service.js';
import { prisma } from '../utils/prisma.util.js';

const authService = new AuthService();

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /** 회원가입 */
  signUp = async (req, res, next) => {
    try {
      // 작성 정보 받아오기
      const { email, password, passwordConfirm, nickname, role, contactNumber, address, image } = req.body;

      // user 생성하기
      const user = await this.authService.signUp({
        email,
        password,
        passwordConfirm,
        nickname,
        address,
        role,
        image,
        contactNumber,
      });

      // 성공 메세지 반환
      res.status(200).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
    return;
  };
}
