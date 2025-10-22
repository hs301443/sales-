import Joi from 'joi';

export const createPaymentSchema = Joi.object().keys({
  lead_id: Joi.string().required().trim(),
  sales_id: Joi.string().required().trim(),
  product_id: Joi.string().required().trim(),
  offer_id: Joi.string().required().trim(),
  payment_method_id: Joi.number().required(),
  amount: Joi.number().required(),
});

export const updatePaymentSchema = Joi.object().keys({
  lead_id: Joi.string().optional().trim(),
  sales_id: Joi.string().optional().trim(),
  product_id: Joi.string().optional().trim(),
  offer_id: Joi.string().optional().trim(),
  payment_method_id: Joi.number().optional(),
  amount: Joi.number().optional(),
});

