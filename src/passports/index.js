import passport from 'passport';
import { prisma } from '../utils/prisma.util.js';
import { kakaoStrategy } from './kakao.passport.js';
import { naverStrategy } from './naver.passport.js';

export const strategies = () => {
  //시리얼라이즈
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  //디시리얼라이즈
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { userId: id } });
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  });

  kakaoStrategy();
  naverStrategy();
};
