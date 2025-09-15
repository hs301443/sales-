import Joi from "joi";

export const createScheduledContactValidation = Joi.object({ 
  lead_id: Joi.string().hex().length(24).required().trim(),
  sales_id: Joi.string().hex().length(24).required().trim(),
  contact_date: Joi.date().required(),
  notes: Joi.string().required().trim(),
  status: Joi.boolean().optional(),
});

export const updateScheduledContactValidation = Joi.object({
  lead_id: Joi.string().hex().length(24).optional().trim(),
  sales_id: Joi.string().hex().length(24).optional().trim(),
  contact_date: Joi.date().optional(),
  notes: Joi.string().optional().trim(),
  status: Joi.boolean().optional(),
});