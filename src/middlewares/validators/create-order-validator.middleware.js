import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

const schema = Joi.object({
  cartId: Joi.number().required().messages({
    'any.required': MESSAGES.ORDERS.CREATED.NO_CART,
  }),
  storeId: Joi.number().required().messages({
    'any.required': MESSAGES.ORDERS.CREATED.NO_STORE,
  }),
  orderItems: Joi.array().items(
    Joi.number().required().messages({
      'any.required': MESSAGES.REVIEWS.COMMON.RATING.REQUIRED,
    }),
  ),
});

export const createOrderValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
