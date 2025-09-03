import Joi from "joi";

export const paymentMethodSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().required(),
  status: Joi.boolean().optional(),
  logo_url: Joi.string().required(),
});

export const updatePaymentMethodSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().optional(),
  status: Joi.boolean().optional(),
  logo_url: Joi.string().optional(),
});