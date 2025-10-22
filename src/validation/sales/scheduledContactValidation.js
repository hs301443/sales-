import Joi from "joi";

export const createScheduledContactValidation = Joi.object({ 
  lead_id: Joi.number().required(),
  contact_date: Joi.date().required(),
  contact_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:MM format
  notes: Joi.string().required().trim(),
  status: Joi.boolean().optional(),
});

export const updateScheduledContactValidation = Joi.object({
  lead_id: Joi.number().optional(),
  contact_date: Joi.date().optional(),
  contact_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(), // HH:MM format
  notes: Joi.string().optional().trim(),
  status: Joi.boolean().optional(),
});