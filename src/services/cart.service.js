import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class CartService {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  //내 카트에 메뉴를 담는 method
  //새로 addCartItem을 할 때, storeId가 기존에 있던 menu의 storeId와 다르면 에러를 발생시키고 싶음.
  addCartItem = async (customerId, storeId, menuId) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(customerId, storeId, menuId);
    const addedCartItem = await this.cartRepository.createCartItem(customerId, storeId, menuId);

    //이미 담은 메뉴가 있으면...
    if (isExistingCartItem === true) {
      //existCartItem의 storeId값이 다르면 에러처리 **이렇게 처리하는게 맞나?
      if (storeId !== isExistingCartItem.storeId) {
        throw new HttpError.Conflict(MESSAGES.CARTS.CREATE.CONFLICTED_STORE);
      }

      if (menuId === isExistingCartItem.menuId) {
        throw new HttpError.Conflict(MESSAGES.CARTS.CREATE.CONFLICTED_MENU);
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
  increaseCartItem = async (customerId, storeId, menuId) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(storeId, menuId);

    if (!isExistingCartItem) {
      await this.cartRepository.createCartItem(customerId, storeId, menuId);
    }

    return await this.cartRepository.increaseCartItem(customerId, menuId);
  };

  decreaseCartItem = async (customerId, storeId, menuId) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(customerId, storeId, menuId);

    if (!isExistingCartItem) {
      throw HttpError.NotFound(MESSAGES.CARTS.UPDATE.NOT_FOUND);
    }

    if (isExistingCartItem.quantity <= 1) {
      throw HttpError.BadRequest(MESSAGES.CARTS.UPDATE.BAD_REQUEST);
    }

    //이미 cart에 같은 아이템이 있으면 quantity를 하나 감소
    const decreasedCartItem = await this.cartRepository.decreaseCartItem(customerId, menuId);

    return decreasedCartItem;
  };

  //장바구니에 담긴 아이템을 삭제하는 method
  deleteCartItem = async (customerId, storeId, menuId) => {
    const isExistingCartItem = await this.cartRepository.getMyCartItemById(customerId, storeId, menuId);

    if (isExistingCartItem !== true) {
      throw new HttpError.NotFound(MESSAGES.CARTS.DELETE.NOT_FOUND);
    }

    return await this.cartRepository.deleteCartItem(customerId, menuId);
  };
}

export default CartService;
