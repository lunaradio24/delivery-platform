import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { compareWithHashed, generateAccessToken, generateRefreshToken } from '../utils/auth.util.js';

export class AuthService {
  constructor(authRepository, userRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }

  // method 작성해주시면 됩니다.
}
