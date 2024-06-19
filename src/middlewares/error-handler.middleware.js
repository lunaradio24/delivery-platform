import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    // joi에서 발생한 에러 처리
    case 'ValidationError':
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: err.message,
      });

    // JWT verify method에서 발생한 에러 처리
    case 'TokenExpiredError':
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.EXPIRED,
      });

    case 'JsonWebTokenError':
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: MESSAGES.AUTH.COMMON.JWT.INVALID,
      });

    // HttpError와 그 밖의 예상치 못한 에러 처리
    default:
      return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: err.message || '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
      });
  }
};

export default errorHandler;
