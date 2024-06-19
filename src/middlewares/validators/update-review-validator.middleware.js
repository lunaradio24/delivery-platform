import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { MAX_REVIEW_LENGTH } from '../../constants/review.constant.js';

const schema = Joi.object({
  rating: Joi.number().optional(),
  content: Joi.string().optional().max(MAX_REVIEW_LENGTH).messages({
    'string.max': MESSAGES.REVIEWS.COMMON.CONTENT.MAX_LENGTH,
  }),
  image: Joi.string().optional(),
})
  .min(1)
  .messages({
    'object.min': MESSAGES.REVIEWS.UPDATE.NO_BODY_DATA,
  });

export const updateReviewValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
