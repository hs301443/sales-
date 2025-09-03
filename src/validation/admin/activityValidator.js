import Joi from "joi";

export const createActivitySchema = Joi.object({
  name: Joi.string().trim().required(),
  status: Joi.boolean().optional(),
});

export const updateActivitySchema = Joi.object({
  name: Joi.string().trim().optional(),
  status: Joi.boolean().optional(),
});