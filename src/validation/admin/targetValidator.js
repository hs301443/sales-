import Joi from "joi";

export const createTargetSchema = Joi.object({
  name: Joi.string().trim().required(),
  point: Joi.number().required(),
  status: Joi.string().valid('Active', 'inactive').optional(),
});

export const updateTargetSchema = Joi.object({
  name: Joi.string().trim().optional(),
  point: Joi.number().optional(),
  status: Joi.string().valid('Active', 'inactive').optional(),
});