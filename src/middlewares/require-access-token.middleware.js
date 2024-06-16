import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { verifyAccessToken } from '../utils/auth.util.js';
import { UserService } from '../services/users.service.js';

export const requireAccessToken = async (req, res, next) => {
  try {
    // 인증 정보 파싱
    const authorization = req.headers.authorization;

    // Authorization이 없는 경우
    if (!authorization) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);

    const [type, accessToken] = authorization.split(' ');

    // JWT 표준 인증 형태와 일치하지 않는 경우
    if (type !== 'Bearer') throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);

    // AccessToken이 없는 경우
    if (!accessToken) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);

    const payload = verifyAccessToken(accessToken);
    const { userId } = payload;
    const userService = new UserService();
    const user = await userService.getMyInfo(userId);

    // Payload에 담긴 사용자 ID와 일치하는 사용자가 없는 경우
    if (!user) throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_USER);

    // req.user에 사용자 정보 넣어서 넘겨줌
    req.user = user;
    next();

    // 에러 처리
  } catch (error) {
    next(error);
  }
};
