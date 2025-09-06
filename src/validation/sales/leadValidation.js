import Joi from "joi";

export const Lead = Joi.object({ 
  name: Joi.string().required(),
  phone: Joi.string().required(),
  activity_id: Joi.string().required(),
});