import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { MAX_REVIEW_LENGTH } from '../../constants/review.constant.js';

const schema = Joi.object({
  storeId: Joi.number().required().message({
    'any.required': MESSAGES.REVIEWS.COMMON.STORE_ID.REQUIRED,
  }),
  orderId: Joi.number().required().message({
    'any.required': MESSAGES.REVIEWS.COMMON.ORDER_ID.REQUIRED,
  }),
  rating: Joi.number().required().messages({
    'any.required': MESSAGES.REVIEWS.COMMON.RATING.REQUIRED,
  }),
  content: Joi.string().optional().max(MAX_REVIEW_LENGTH).messages({
    'string.max': MESSAGES.REVIEWS.COMMON.CONTENT.MAX_LENGTH,
  }),
  image: Joi.string().optional(),
});

export const createReviewValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
