import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }
  // method 작성하시면 됩니다.

  /*
   carts Create API

   req.header : id (users)

   req.body : 
    store_id ( 내가 선택한 가게가 default로 입력? )
    order { menu_id , address(default : users - address) }
  
  
   res.send(status : 201, { costomer_id, cart }) 
   */

  addCartItem = async (req, res, next) => {
    try {
      const { id: customerId } = req.user;
      const { storeId, menuId } = req.body;

      const addedCartItem = await this.cartService.addCartItem(customerId, storeId, menuId);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.CARTS.CREATE.SUCCEED,
        data: addedCartItem,
      });
    } catch (error) {
      next(error);
    }
  };

  /*
  cart Get API

  req.header : id

  */

  readMyCart = async (req, res, next) => {
    try {
      const { id: customerId } = req.user;

      const myCart = await this.cartService.readMyCart(customerId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CARTS.READ.SUCCEED,
        data: myCart,
      });
    } catch (error) {
      next(error);
    }
  };

  /* 

  cart 수량 증가 API

  */
  increaseCartItem = async (req, res, next) => {
    try {
      const { customerId } = req.user;
      const { menuId, quantity } = req.body;

      const increasedCartItem = await this.cartService.increaseCartItem(customerId, storeId, menuId, quantity);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CARTS.UPDATE.SUCCEED,
        data: increasedCartItem,
      });
    } catch (error) {
      next(error);
    }
  };

  /* 
  
  cart 수량 감소 API

  */

  decreaseCartItem = async (req, res, next) => {
    try {
      const { customerId } = req.user;
      const { menuId, quantity } = req.body;

      const decreasedCartItem = await this.cartService.decreaseCartItem(customerId, storeId, menuId, quantity);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CARTS.UPDATE.SUCCEED,
        data: decreasedCartItem,
      });
    } catch (error) {
      next(error);
    }
  };

  /* 
  cart 삭제 API
  */
  deleteCartItem = async (req, res, next) => {
    try {
      const { customerId } = req.user;
      const { storeId, menuId } = req.body;

      const deletedCartItem = await this.cartService.deleteCartItem(customerId, storeId, menuId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CARTS.DELETE.SUCCEED,
        data: deletedCartItem,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CartController;
