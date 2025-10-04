import Joi from 'joi';

export const createLeadSchema = Joi.object().keys({
  name: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  address: Joi.string().optional().trim(),
  type: Joi.string().required().valid('sales', 'company').trim(),
  status: Joi.string().optional().valid('default','intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
  sales_id: Joi.string().required().trim(),
  activity_id: Joi.string().optional().trim(),
  source_id: Joi.string().optional().trim(),
});

export const updateLeadSchema = Joi.object().keys({
  name: Joi.string().optional().trim(),
  phone: Joi.string().optional().trim(),
  address: Joi.string().optional().trim(),
  type: Joi.string().optional().valid('sales', 'company').trim(),
  status: Joi.string().optional().valid('default','intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
  sales_id: Joi.string().optional().trim(),
  activity_id: Joi.string().optional().trim(),
  source_id: Joi.string().optional().trim(),
});

