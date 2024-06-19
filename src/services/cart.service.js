import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { MenuRepository } from '../repositories/menu.repository.js';

class CartService {
  // method 작성해주시면 됩니다.

  //카트 구조 만드는 서비스 = 회원가입 시 자동으로 만들어짐.
  //주문자 id 필요
  //
  createMyCart = async (userId) => {
    const myCart = await prisma.cartItem.create({
      data: {
        customer: { connect: { id: userId } },
      },
    });

    return data;
  };

  putMenuInMyCart = async ({ storeId, menuId }) => {};

  readCart = async () => {};

  patchCart = async () => {};

  deleteCart = async () => {};
}

const cartService = new CartService();
export default cartService;
