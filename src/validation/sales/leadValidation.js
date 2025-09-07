import Joi from "joi";

export const leadValidation = Joi.object({ 
  name: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  sales_id: Joi.string().required(),
  activity_id: Joi.string().required(),
});