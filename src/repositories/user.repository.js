import BaseRepository from './base.repository.js';

class UserRepository extends BaseRepository {
  /** 회원가입 */
  // email 확인하기
  getByEmail = async (email) => {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  };

  // nickname 확인하기
  getByNickname = async (nickname) => {
    const user = await this.prisma.user.findUnique({
      where: { nickname },
    });
    return user;
  };

  create = async ({ email, password, nickname, role, contactNumber, address, image }) => {
    // user 생성하기
    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        nickname,
        role,
        contactNumber,
        address,
        image,
      },
    });
    // password 제외하기
    const { password: _password, ...withoutPasswordUser } = user;
    return withoutPasswordUser;
  };

  // userId로 user 찾기
  findById = async (userId) => {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  };

  // userId에 맞는 user 정보 수정
  update = async (userId, nickname, address, image, contactNumber) => {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname,
        address,
        image,
        contactNumber,
      }
    });
  };

  // 잔액 추가
  addWallet = async (Id, totalPrice, { tx }) => {
    const orm = tx || this.prisma;
    await orm.user.update({
      where: { id: Id },
      data: { wallet: { increment: totalPrice } },
      decrement,
    }); //잔액을 totalPrice만큼 추가
  };

  // 잔액 차감
  deductionWallet = async (id, totalPrice, { tx }) => {
    const orm = tx || this.prisma;
    await orm.user.update({
      where: { id: id },
      data: { wallet: { decrement: totalPrice } },
    });
  }; //잔액을 totalPrice만큼 차감

  //스토어 id 파싱
  findeStoreId = async (userId) => {
    const findeStoreId = await this.prisma.user.findUnique({
      where: { id: +userId },
      include: {
        store: true,
      },
    });
    return findeStoreId;
  };
}

export default UserRepository;