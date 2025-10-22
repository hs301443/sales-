import Joi from "joi";

export const createleadValidation = Joi.object({ 
  name: Joi.string().required().trim(),
  phone: Joi.string().required().trim(),
  country: Joi.number().required(),
  city: Joi.number().required(),
  //sales_id: Joi.number().required(),
  activity_id: Joi.number().optional(),
  source_id: Joi.number().required(),
});

export const updateleadValidation = Joi.object({
  name: Joi.string().optional().trim(),
  phone: Joi.string().optional().trim(),
  country: Joi.number().optional(),
  city: Joi.number().optional(),
  status: Joi.string().optional().valid('default','intersted', 'negotiation', 'demo_request', 'demo_done', 'reject', 'approve').trim(),
 // sales_id: Joi.number().optional(),
  activity_id: Joi.number().optional(),
  source_id: Joi.number().optional(),
});