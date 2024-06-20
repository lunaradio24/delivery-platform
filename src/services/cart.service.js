import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class CartService {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  //내 카트에 메뉴를 담는 method
  //새로 addCartItem을 할 때, storeId가 기존에 있던 menu의 storeId와 다르면 에러를 발생시키고 싶음.
  addCartItem = async (customerId, storeId, menuId) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(storeId, menuId);
    const addedCartItem = await this.cartRepository.createCartItem(customerId, storeId, menuId);

    //이미 담은 메뉴가 있으면...
    if (isExistingCartItem === true) {
      //existCartItem의 storeId값이 다르면 에러처리 **이렇게 처리하는게 맞나?
      if (storeId !== isExistingCartItem.storeId) {
        throw new HttpError.Conflict(MESSAGES.CARTS.CREATE.CONFLICTED_STORE);
      }

      if (menuId === isExistingCartItem.menuId) {
        throw new HttpError.Conflict(MESSAGES.CARTS.COMMON.CONFLICTED_MENU);
      }

      return addedCartItem;
    }

    return addedCartItem;
  };

  //내 카트를 조회하는 method
  readMyCart = async (customerId) => {
    const readMyCart = await this.cartRepository.getMyCartById(customerId);

    return readMyCart;
  };

  //장바구니에 담긴 아이템을 수정하는 method
  updateCartItem = async (customerId, storeId, menuId, quantity) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(storeId, menuId);
    const updatedCartItem = await this.cartRepository.updateCartItem(customerId, menuId, quantity);

    //이미 cart에 같은 아이템이 있으면 quantity를 입력된 값으로 변경
    if (isExistingCartItem === true) {
      return updatedCartItem;
    }
  };

  //장바구니에 담긴 아이템을 삭제하는 method
  deleteCartItem = async (storeId, menuId) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(storeId, menuId);
    const deletedCartItem = await this.cartRepository.deleteCartItem(menuId);

    if (isExistingCartItem !== true) {
      throw new HttpError.NotFound(MESSAGES.CARTS.DELETE.NOT_FOUND);
    }

    return deletedCartItem;
  };
}

export default CartService;
