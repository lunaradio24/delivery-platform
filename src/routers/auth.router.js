import express from 'express';
import { signUpValidator } from '../middlewares/validators/sign-up-validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in-validator.middleware.js';
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import { authController } from '../di/dependency-injected-instances.js';

const authRouter = express.Router();

/** 회원가입 API */
authRouter.post('/sign-up', signUpValidator, authController.signUp);

/** Email 인증 API */
authRouter.post('/email', authController.verifyEmail);

/** Email 인증번호 확인 API*/


/** 로그인 API */
authRouter.post('/sign-in', signInValidator, authController.signIn);

/** 로그아웃 API */
authRouter.post('/sign-out', requireRefreshToken, authController.signOut);

/** 토큰 재발급 API */
authRouter.post('/renew-tokens', requireRefreshToken, authController.renewTokens);

/** 네이버 로그인 API */

/** 카카오 로그인 API */

export { authRouter };
