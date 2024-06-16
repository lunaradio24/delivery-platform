import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getMyInfo = async () => {
    // 내용 채워주시면 됩니다.
  };

  // method 작성해주시면 됩니다.
}
