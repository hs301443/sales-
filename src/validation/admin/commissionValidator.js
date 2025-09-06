import Joi from 'joi';

export const createCommissionSchema = Joi.object().keys({
  point_threshold: Joi.number().integer().min(0).required()
    .messages({
      'number.base': 'Point threshold must be a number',
      'number.integer': 'Point threshold must be an integer',
      'number.min': 'Point threshold cannot be negative',
      'any.required': 'Point threshold is required'
    }),
  amount: Joi.number().min(0).required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.min': 'Amount cannot be negative',
      'any.required': 'Amount is required'
    }),
  type: Joi.string().valid('percentage', 'fixed').required()
    .messages({
      'string.base': 'Type must be a string',
      'any.only': 'Type must be either percentage or fixed',
      'any.required': 'Type is required'
    }),
  level_name: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.base': 'Level name must be a string',
      'string.empty': 'Level name cannot be empty',
      'string.min': 'Level name must be at least 1 character long',
      'string.max': 'Level name cannot exceed 100 characters',
      'any.required': 'Level name is required'
    })
});

export const updateCommissionSchema = Joi.object().keys({
  point_threshold: Joi.number().integer().min(0).optional()
    .messages({
      'number.base': 'Point threshold must be a number',
      'number.integer': 'Point threshold must be an integer',
      'number.min': 'Point threshold cannot be negative'
    }),
  amount: Joi.number().min(0).optional()
    .messages({
      'number.base': 'Amount must be a number',
      'number.min': 'Amount cannot be negative'
    }),
  type: Joi.string().valid('percentage', 'fixed').optional()
    .messages({
      'string.base': 'Type must be a string',
      'any.only': 'Type must be either percentage or fixed'
    }),
  level_name: Joi.string().trim().min(1).max(100).optional()
    .messages({
      'string.base': 'Level name must be a string',
      'string.empty': 'Level name cannot be empty',
      'string.min': 'Level name must be at least 1 character long',
      'string.max': 'Level name cannot exceed 100 characters'
    })
});