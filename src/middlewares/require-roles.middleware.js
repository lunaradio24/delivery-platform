import { ROLES } from '../constants/enum.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { HttpError } from '../errors/http.error.js';

const requireRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // access token 검증 미들웨어를 통해 사용자 정보 가져오기
      const { role: userRole } = req.user;

      // 배열로 받은 접근 허용된 역할들을 DB에 지정된 숫자로 변환
      const allowedRoleIndices = allowedRoles.map((role) => ROLES[role]);

      // 사용자의 역할이 허용된 역할 목록에 포함되는지 확인
      if (!allowedRoleIndices.includes(userRole)) {
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
