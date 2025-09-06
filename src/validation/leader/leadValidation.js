import Joi from "joi";

export const transferLead = Joi.object({ 
  salesId: Joi.string().hex().length(24).required()
});