import Joi from "joi";

export const createleadValidation = Joi.object({ 
  name: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  address: Joi.string().optional().trim(),
  sales_id: Joi.string().required().trim(),
  activity_id: Joi.string().optional().trim(),
  source_id: Joi.string().optional().trim(),
});

export const updateleadValidation = Joi.object({
  name: Joi.string().optional().trim(),
  phone: Joi.string().optional().trim(),
  address: Joi.string().optional().trim(),
  status: Joi.string().optional().valid('intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
  sales_id: Joi.string().optional().trim(),
  activity_id: Joi.string().optional().trim(),
  source_id: Joi.string().optional().trim(),
});