import passport from 'passport';
import { prisma } from '../utils/prisma.util.js';
import { Strategy as NaverStrategy } from 'passport-naver';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_CALLBACK_URI } from '../constants/env.constant.js';

const naverStrategy = () => {
  passport.use(
    'naver',
    new NaverStrategy(
      {
        clientID: NAVER_CLIENT_ID,
        clientSecret: NAVER_CLIENT_SECRET,
        callbackURL: NAVER_CALLBACK_URI,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('naver profile', profile);
        try {
          // users DB의 email중 해당 이메일과 일치 하는 경우
          const existingUser = await prisma.user.findFirst({
            where: { email: profile._json.email },
          });
          // 이미 가입된 프로필이면 성공
          if (existingUser) {
            console.log('가입 이력 있음', accessToken);
            done(null, existingUser);
          }
          // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다.
          else {
            const newUser = await prisma.user.create({
              data: {
                email: profile._json.email,
                username: profile.displayName,
                profileImage: profile._json.profile_image,
                emailVerified: true,
                socialLoginProvider: 'naver',
              },
            });
            console.log('가입 이력 없음', accessToken);
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};

export { naverStrategy };
