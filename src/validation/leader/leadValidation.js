import Joi from "joi";

export const transferLead = Joi.object({ 
  salesId: Joi.string().hex().length(24).required()
});

export const updateActivitySchema = Joi.object({
  name: Joi.string().trim().optional(),
  status: Joi.boolean().optional(),
});