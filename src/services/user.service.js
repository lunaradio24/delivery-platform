import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // userId로 user 찾기
  getMyInfo = async (userId) => {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError.NotFound(MESSAGES.USERS.NOT_FOUND);
    }

    // password 제외하기
    const { password: _, ...withoutPasswordUser } = user;
    return withoutPasswordUser;
  };

  // userId에 맞는 user정보 수정
  updateMyInfo = async (userId, nickname, address, image, contactNumber) => {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new HttpError.NotFound(MESSAGES.USERS.NOT_FOUND);
    }

    const updatingUser =  await this.userRepository.update(userId, nickname, address, image, contactNumber);

    // password 제외하기
    const { password: _, ...withoutPasswordUser } = updatingUser;
    return withoutPasswordUser;
  };
}

export default UserService;
