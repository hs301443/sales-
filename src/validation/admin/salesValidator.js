import Joi from 'joi';

export const createSalesSchema = Joi.object().keys({
  name: Joi.string().required().trim(),
  email: Joi.string().required().email().trim(),
  password: Joi.string().required().min(6).trim(),
  leader_id: Joi.string().required().trim(),
});

export const updateSalesSchema = Joi.object().keys({
  name: Joi.string().optional().trim(),
  email: Joi.string().optional().email().trim(),
  password: Joi.string().optional().min(6).trim(),
  leader_id: Joi.string().optional().trim(),
});

