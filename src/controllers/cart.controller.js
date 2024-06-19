import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

/* nessesary Prisma Table
: users
  - id
  - address

: stores
  - id

: menus
  - id

*/

export class CartController {
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

  createCart = async (req, res, next) => {
    try {
      const { costomerId } = req.user;
      const { storeId } = req.header;

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.CARTS.CREATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /*
  cart Get API

  req.header : id

  */

  readCart = async (req, res, next) => {
    try {
      const { costomer_id } = req.user;

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.CARTS.READ.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /* 
  cart 수정 API
  */
  updateCart = async (req, res, next) => {
    try {
      const { costomer_id } = req.user;

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.CARTS.UPDATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /* 
  cart 삭제 API
  */
  deleteCart = async (req, res, next) => {
    try {
      const { costomer_id } = req.user;

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.CARTS.UPDATE.SUCCEED,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
