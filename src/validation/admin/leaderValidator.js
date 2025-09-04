import Joi from 'joi';

export const createLeaderSchema = Joi.object().keys({
  name: Joi.string().required().trim(),
  email: Joi.string().required().email().trim(),
  password: Joi.string().required().min(6).trim(),
  role: Joi.string().required().valid('Sales Leader'),
  status: Joi.string().optional().valid('Active', 'Inactive'),
});

export const updateLeaderSchema = Joi.object().keys({
  name: Joi.string().optional().trim(),
  email: Joi.string().optional().email().trim(),
  password: Joi.string().optional().min(6).trim(),
  role: Joi.string().optional().valid('Sales Leader'),
  status: Joi.string().optional().valid('Active', 'Inactive'),
});

