import Joi from "joi";

export const CreateUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Salesman', 'Sales Leader', 'Admin').required(),
  status: Joi.string().valid('Active', 'inactive'),
  target_id: Joi.string().optional(),
});


export const UpdateUserSchema = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('Salesman', 'Sales Leader', 'Admin').optional(),
  status: Joi.string().valid('Active', 'inactive').optional(),
  target_id: Joi.string().optional(),
});