import Joi from 'joi';

export const addMessageValidation = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  receiverId: Joi.string().hex().length(24).required(),
});