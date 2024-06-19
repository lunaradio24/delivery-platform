import Joi from 'joi';

const schema = Joi.object({
  // joi 스키마를 작성해주세요.
});

export const menuValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
