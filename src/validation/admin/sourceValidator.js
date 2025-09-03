import Joi from "joi";

export const createSourceSchema = Joi.object({
  name: Joi.string().trim().required(),
  status: Joi.string().valid('Active', 'inactive').optional(),
});

export const updateSourceSchema = Joi.object({
  name: Joi.string().trim().optional(),
  status: Joi.string().valid('Active', 'inactive').optional(),
});