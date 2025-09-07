import Joi from "joi";

export const transferLeadSchema = Joi.object({ 
  salesId: Joi.string().hex().length(24).required()
});