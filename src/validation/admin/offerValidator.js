import Joi from "joi";

export const createOfferSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow('', null),
  start_date: Joi.date().optional(),
  end_date: Joi.date().greater(Joi.ref('start_date')).optional(),
  discount_type: Joi.string().valid('percentage', 'value').required(),
  discount_amount: Joi.alternatives().conditional('discount_type', {
    is: 'percentage',
    then: Joi.number().min(0).max(100).required(),
    otherwise: Joi.number().min(0).required()
  }),
  subscription_details: Joi.string().trim().optional().allow('', null),
  setup_phase: Joi.string().trim().optional().allow('', null),
  product_id: Joi.string().required()
});

export const updateOfferSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional().allow('', null),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  discount_type: Joi.string().valid('percentage', 'value').optional(),
  discount_amount: Joi.number().min(0).optional(),
  subscription_details: Joi.string().trim().optional().allow('', null),
  setup_phase: Joi.string().trim().optional().allow('', null),
  product_id: Joi.string().hex().length(24).optional()
});