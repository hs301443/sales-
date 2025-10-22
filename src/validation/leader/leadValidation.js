import Joi from "joi";

export const transferLeadSchema = Joi.object({ 
  salesId: Joi.number().required()
});