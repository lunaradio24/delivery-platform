import Joi from 'joi';
import { MESSAGES } from '../../constants/message.constant.js';
import { PHONE_NUMBER_REG_EXP } from '../../constants/auth.constant.js';

const schema = Joi.object({
  nickname: Joi.string().messages(),
  contactNumber: Joi.string().regex(PHONE_NUMBER_REG_EXP).messages({
    'string.pattern.base': MESSAGES.AUTH.COMMON.CONTACT_NUMBER.INVALID_FORMAT,
  }),
  address: Joi.string(),
  image: Joi.string(),
})
  .min(1)
  .messages({
    'object.min': MESSAGES.USERS.UPDATE_ME.AT_LEAST,
  });

export const profileValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
