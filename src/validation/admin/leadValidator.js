import Joi from 'joi';

export const createLeadSchema = Joi.object().keys({
  name: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
  city: Joi.string().optional().trim(),
  type: Joi.string().required().valid('sales', 'company').trim(),
  status: Joi.string().optional().valid('default','intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
  sales_id: Joi.number().required(),
  activity_id: Joi.number().optional(),
  source_id: Joi.number().optional(),
});

export const updateLeadSchema = Joi.object().keys({
  name: Joi.string().optional().trim(),
  phone: Joi.string().optional().trim(),
  country: Joi.string().optional().trim(),
  city: Joi.string().optional().trim(),
  type: Joi.string().optional().valid('sales', 'company').trim(),
  status: Joi.string().optional().valid('default','intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
  sales_id: Joi.number().optional(),
  activity_id: Joi.number().optional(),
  source_id: Joi.number().optional(),
});

