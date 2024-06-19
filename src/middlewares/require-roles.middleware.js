import { ROLES } from '../constants/auth.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

const requireRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // access token 검증 미들웨어를 통해 사용자 정보 가져오기
      const { role: roleIndex } = req.user;
      const role = ROLES[roleIndex];

      // 사용자의 역할이 허용된 역할 목록에 포함되는지 확인
      if (!allowedRoles.includes(role)) {
        throw new HttpError.Forbidden(MESSAGES.AUTH.COMMON.ROLE.NO_ACCESS_RIGHT);
      }

      // 허용된 경우 다음 미들웨어로 진행
      next();

      // 허용되지 않은 경우 발생한 에러 처리
    } catch (error) {
      next(error);
    }
  };
};

export { requireRoles };
