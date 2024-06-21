import express from 'express';
import passport from 'passport';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { authController } from '../di/dependency-injected-instances.js';

const authRouter = express.Router();

/** 회원가입 API */
authRouter.post('/sign-up', signUpValidator, authController.signUp);

/** Email 보내기 */
authRouter.post('/send-email', authController.sendEmail);

/** Email 인증 API */
authRouter.post('/verify-email', authController.verifyEmail);

/** 로그인 API */
authRouter.post('/sign-in', signInValidator, authController.signIn);

/** 로그아웃 API */
authRouter.post('/sign-out', requireRefreshToken, authController.signOut);

/** 토큰 재발급 API */
authRouter.post('/renew-tokens', requireRefreshToken, authController.renewTokens);

/** 네이버 로그인 API */
authRouter.get('/naver', passport.authenticate('naver', { session: false })); // 네이버 로그인 페이지로 이동
authRouter.get(
  '/naver/callback',
  passport.authenticate('naver', {
    session: false,
    failureRedirect: '/?error=로그인실패', // 로그인에 실패했을 경우 해당 라우터로 이동한다
  }),
);

/** 카카오 로그인 API */

export { authRouter };
