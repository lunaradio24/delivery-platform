import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { verifyRefreshToken, compareWithHashed } from '../utils/auth.util.js';
import { UserService } from '../services/user.service.js';
import { AuthRepository } from '../repositories/auth.repository.js';

export const requireRefreshToken = async (req, res, next) => {
  try {
    // 인증 정보 파싱
    const authorization = req.headers.authorization;

    // Authorization이 없는 경우
    if (!authorization) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);

    const [type, refreshToken] = authorization.split(' ');

    // JWT 표준 인증 형태와 일치하지 않는 경우
    if (type !== 'Bearer') throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);

    // payload에 담긴 사용자 ID를 이용하여 사용자 정보 조회
    const payload = verifyRefreshToken(refreshToken);
    const { userId } = payload;
    const userService = new UserService();
    const user = await userService.getMyInfo(userId);

    // payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
    if (!user) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_USER);

    // DB에 저장된 Refresh Token 조회
    const authRepository = new AuthRepository();
    const { token: savedRefreshToken } = await authRepository.findRefreshTokenByUserId(userId);

    // 사용자가 가지고 있는 Refresh Token과 비교
    const isPasswordMatched = await compareWithHashed(refreshToken, savedRefreshToken);
    if (!isPasswordMatched) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.INVALID);

    // req.user에 사용자 정보 넣어서 넘겨줌
    req.user = user;
    next();

    // 에러 처리
  } catch (error) {
    next(error);
  }
};
