import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

const schema = Joi.object({
  storeId: Joi.number().required().messages({
    'any.required': MESSAGES.ORDERS.CREATE.NO_STORE,
  }),
  orderItems: Joi.array()
    .items(
      Joi.object({
        menuId: Joi.number().required().messages({
          'any.required': MESSAGES.ORDERS.CREATE.NO_MENU_ID,
        }),
        quantity: Joi.number().required().messages({
          'any.required': MESSAGES.ORDERS.CREATE.NO_QUANTITY,
        }),
      }),
    )
    .required()
    .messages({
      'any.required': MESSAGES.ORDERS.CREATE.NO_ORDER,
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
