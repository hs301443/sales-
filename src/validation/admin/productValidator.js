import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow('', null),
  price_month: Joi.number().min(0).optional(),
  price_quarter: Joi.number().min(0).optional(),
  price_year: Joi.number().min(0).optional(),
  setup_fees: Joi.number().min(0).required().default(0),
  status: Joi.boolean().optional().default(true),
  created_at: Joi.date().optional().default(Date.now)
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional().allow('', null),
  price_month: Joi.number().min(0).optional(),
  price_quarter: Joi.number().min(0).optional(),
  price_year: Joi.number().min(0).optional(),
  setup_fees: Joi.number().min(0).optional(),
  status: Joi.boolean().optional(),
  created_at: Joi.date().optional()
});