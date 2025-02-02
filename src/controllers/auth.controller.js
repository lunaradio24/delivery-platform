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
      const { email, password, nickname, role, contactNumber, address, image } = req.body;

      // user 생성하기
      const createdUser = await this.authService.signUp({
        email,
        password,
        nickname,
        address,
        role,
        image,
        contactNumber,
      });

      // 성공 메세지 반환
      res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: createdUser,
      });
    } catch (error) {
      next(error);
    }
    return;
  };

  /** 인증번호 발송 */
  sendEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      await this.authService.sendEmail(email);

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.COMMON.EMAIL.SEND,
      });
    } catch (error) {
      next(error);
    }
  };

  /** 인증번호 확인 */
  verifyEmail = async (req, res, next) => {
    try {
      const { email, verificationCode } = req.body;
      await this.authService.verifyEmail(email, verificationCode);

      // 성공 메세지 반환
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.COMMON.EMAIL.VERIFIED,
      });
    } catch (error) {
      next(error);
    }
  };

  /** 로그인 */
  signIn = async (req, res, next) => {
    try {
      // 작성 정보 받아오기
      const { email, password } = req.body;

      // user 찾아오기
      const user = await this.authService.signIn(email, password);

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

  /** 네이버 로그인 */
  // naverLogin = async (req, res, next) => {
  //   try {
  //     const { id: userId } = req.user;

  //     // auth session code를 redis에 저장
  //     await redis.set(userId, {
  //         userId: userId,
  //         sessionCode: authSessionCode,
  //         expiredAt: new Date(Date.now() + 1 * 60 * 1000),
  //
  //     });

  //     // 로그인에 성공했을 경우 반환 정보
  //     res.status(HTTP_STATUS.OK).redirect(`/session?code=${authSessionCode}`);

  //     // 에러 처리
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default AuthController;
