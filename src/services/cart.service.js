import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class CartService {
  constructor(cartRepository, menuRepository) {
    this.cartRepository = cartRepository;
    this.menuRepository = menuRepository;
  }

  //내 카트에 메뉴를 담는 method
  addCartItem = async (customerId, storeId, menuId) => {
    // menuId에 해당하는 메뉴가 storeId에 해당하는 가게의 메뉴인지 확인
    const menu = await this.menuRepository.findMenuByMenuId(menuId);
    if (menu.storeId !== storeId) {
      throw new HttpError.BadRequest(MESSAGES.MENUS.COMMON.INVALID);
    }

    const existingCartItem = await this.cartRepository.getMyCartItemByMenuId(customerId, menuId);

    // 장바구니에 담긴 메뉴의 가게와 담으려는 메뉴의 가게가 다른 경우
    if (existingCartItem && existingCartItem.storeId !== storeId) {
      throw new HttpError.BadRequest(MESSAGES.CARTS.CREATE.CONFLICTED_STORE);
    }

    let cartItem;
    // 이미 같은 메뉴가 담긴 경우
    if (existingCartItem && existingCartItem.storeId === storeId) {
      cartItem = await this.cartRepository.increaseCartItem(customerId, menuId);
    }
    // 담긴 메뉴가 없는 경우
    else {
      cartItem = await this.cartRepository.createCartItem(customerId, storeId, menuId);
    }

    return cartItem;
  };

  //내 카트를 조회하는 method
  readMyCart = async (customerId) => {
    const readMyCart = await this.cartRepository.getMyCartByCustomerId(customerId);

    return readMyCart;
  };

  //장바구니에 담긴 아이템을 수정하는 method
  increaseCartItem = async (customerId, menuId) => {
    const existingCartItem = await this.cartRepository.getMyCartItemByMenuId(customerId, menuId);

    if (!existingCartItem) {
      throw new HttpError.NotFound(MESSAGES.CARTS.UPDATE.NOT_FOUND);
    }

    return await this.cartRepository.increaseCartItem(customerId, menuId);
  };

  decreaseCartItem = async (customerId, menuId) => {
    const existingCartItem = await this.cartRepository.getMyCartItemByMenuId(customerId, menuId);

    if (!existingCartItem) {
      throw new HttpError.NotFound(MESSAGES.CARTS.UPDATE.NOT_FOUND);
    }

    if (existingCartItem.quantity <= 1) {
      throw new HttpError.BadRequest(MESSAGES.CARTS.UPDATE.NO_DECREASE);
    }

    //이미 cart에 같은 아이템이 있으면 quantity를 하나 감소
    const decreasedCartItem = await this.cartRepository.decreaseCartItem(customerId, menuId);

    return decreasedCartItem;
  };

  //장바구니에 담긴 아이템을 삭제하는 method
  deleteCartItem = async (customerId, menuId) => {
    const deletedCartItem = await this.cartRepository.getMyCartItemByMenuId(customerId, menuId);

    if (!deletedCartItem) {
      throw new HttpError.NotFound(MESSAGES.CARTS.DELETE.NOT_FOUND);
    }

    return await this.cartRepository.deleteCartItemByMenuId(customerId, menuId);
  };
}

export default CartService;
