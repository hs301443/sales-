import Joi from 'joi';

export const createSaleSchema = Joi.object().keys({
  lead_id: Joi.number().required(),
  sales_id: Joi.number().required(),
  product_id: Joi.number().optional(),
  offer_id: Joi.number().optional(),
  payment_id: Joi.string().optional(),
  item_type: Joi.string().valid('Product', 'Offer').required(),
  status: Joi.string().valid('Pending', 'Approve', 'Reject').optional()
});

export const updateSaleSchema = Joi.object().keys({
  lead_id: Joi.number().optional(),
  sales_id: Joi.number().optional(),
  product_id: Joi.number().optional(),
  offer_id: Joi.number().optional(),
  payment_id: Joi.number().optional(),
  item_type: Joi.string().valid('Product', 'Offer').optional(),
  status: Joi.number().valid('Pending', 'Approve', 'Reject').optional()
});