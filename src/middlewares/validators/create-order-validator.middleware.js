import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

const schema = Joi.object({
  storeId: Joi.number().required().messages({
    'any.required': MESSAGES.ORDERS.CREATE.BAD_REQUEST.NO_STORE_ID,
  }),
  orderItems: Joi.array()
    .items(
      Joi.object({
        menuId: Joi.number().required().messages({
          'any.required': MESSAGES.ORDERS.CREATE.BAD_REQUEST.NO_MENU_ID,
        }),
        quantity: Joi.number().required().messages({
          'any.required': MESSAGES.ORDERS.CREATE.BAD_REQUEST.NO_QUANTITY,
        }),
      }),
    )
    .required()
    .messages({
      'any.required': MESSAGES.ORDERS.CREATE.BAD_REQUEST.NO_ORDER,
    }),
});

export const createOrderValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
