import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

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
        nickname,
        address,
        role,
        image,
        contactNumber,
      });

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
    return;
  };

  /** 인증번호 확인 */
  verifyEmail = async (req, res, next) => {
    try {
      const { email, verificationNumber } = req.body;
      await this.authService.verifyEmail(email, verificationNumber);

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.COMMON.EMAIL.VERIFIED,
      });
    } catch (error) {
      next (error);
    };
  }

  /** 로그인 */
  signIn = async (req, res, next) => {
    try {
      // 작성 정보 받아오기
      const { email, password } = req.body;

      // user 찾아오기
      const user = await this.authService.signIn(
        email,
        password,
      );

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /** 로그아웃 */
  signOut = async (req, res, next) => {
    try {
      // userId 가져오기
      const userId = req.user.id;
      await this.authService.signOut(userId);

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
        data: { userId },
      });
    } catch (error) {
      next(error);
    }
  };

  /** 토큰 재발급 */
  renewTokens = async (req, res, next) => {
    try {
      // user 가져오기
      const { id: userId } = req.user;
      const tokens = await this.authService.renewTokens(userId);

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.RENEW_TOKENS.SUCCEED,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
