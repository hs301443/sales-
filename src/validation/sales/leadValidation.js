import Joi from "joi";

export const createleadValidation = Joi.object({ 
  name: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  country: Joi.string().required().trim(),
  city: Joi.string().required().trim(),
  //sales_id: Joi.number().required(),
  activity_id: Joi.number().optional(),
  source_id: Joi.number().required(),
});

export const updateleadValidation = Joi.object({
  name: Joi.string().optional().trim(),
  phone: Joi.string().optional().trim(),
  country: Joi.string().optional().trim(),
  city: Joi.string().optional().trim(),
  status: Joi.string().optional().valid('default','intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
 // sales_id: Joi.number().optional(),
  activity_id: Joi.number().optional(),
  source_id: Joi.number().optional(),
});