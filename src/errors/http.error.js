import { HTTP_STATUS } from '../constants/http-status.constant.js';

class BadRequest {
  constructor(message = BadRequest.name) {
    this.message = message;
    this.status = HTTP_STATUS.BAD_REQUEST;
  }
}

class Unauthorized {
  constructor(message = Unauthorized.name) {
    this.message = message;
    this.status = HTTP_STATUS.UNAUTHORIZED;
  }
}

class Forbidden {
  constructor(message = Forbidden.name) {
    this.message = message;
    this.status = HTTP_STATUS.FORBIDDEN;
  }
}

class NotFound {
  constructor(message = NotFound.name) {
    this.message = message;
    this.status = HTTP_STATUS.NOT_FOUND;
  }
}

class Conflict {
  constructor(message = Conflict.name) {
    this.message = message;
    this.status = HTTP_STATUS.CONFLICT;
  }
}

class InternalServerError {
  constructor(message = InternalServerError.name) {
    this.message = message;
    this.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}

export const HttpError = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  InternalServerError,
};
