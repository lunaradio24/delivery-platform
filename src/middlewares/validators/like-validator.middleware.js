import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';

const schema = Joi.object({
  storeId: Joi.number().required().messages({ 'any.required': MESSAGES.LIKES.COMMON.NO_STORE_ID }),
  isLike: Joi.boolean().required().messages({ 'any.required': MESSAGES.LIKES.COMMON.NO_LIKES }),
});

export const likeValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
