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
    const { password: _, verificationNumber: _v, isVerified: _i, ...withoutPasswordUser } = user;
    return withoutPasswordUser;
  };

  // userId에 맞는 user정보 수정
  updateMyInfo = async (userId, nickname, address, image, contactNumber) => {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new HttpError.NotFound(MESSAGES.USERS.NOT_FOUND);
    }

    // nickname 중복확인
    const existingNickname = await this.userRepository.getByNickname(nickname);
    if (existingNickname) {
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.NICKNAME.DUPLICATED);
    }

    const updatingUser = await this.userRepository.update(userId, nickname, address, image, contactNumber);

    // password 제외하기
    const { password: _p, verificationNumber: _v, isVerified: _i, ...withoutPasswordUser } = updatingUser;
    return withoutPasswordUser;
  };

  userImageUpload = async (userId, imageUrl) => {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser){
      throw new HttpError.NotFound(MESSAGES.USERS.NOT_FOUND);
    }

    const updateImageUpload = await this.userRepository.uploadImage(userId, imageUrl)

    return updateImageUpload
  }
}

export default UserService;
