import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // userId로 user 찾기
  getMyInfo = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError.NotFound(MESSAGES.USERS.NOT_FOUND);
    }
    return user;
  };
}
