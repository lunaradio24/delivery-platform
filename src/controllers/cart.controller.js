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
  
   */

  createCart = async (req, res, next) => {
    try {
      const { costomerId } = req.user;
      const { storeId } = req.header;
    } catch {
      next();
    }
  };
}
