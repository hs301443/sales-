import Joi from 'joi';

export const createSaleSchema = Joi.object().keys({
  lead_id: Joi.string().required().trim(),
  sales_id: Joi.string().required().trim(),
  product_id: Joi.string().optional().trim().allow('', null),
  offer_id: Joi.string().optional().trim().allow('', null),
  payment_id: Joi.string().optional().trim().allow('', null),
  item_type: Joi.string().valid('Product', 'Offer').required(),
  status: Joi.string().valid('Pending', 'Approve', 'Reject').optional()
});

export const updateSaleSchema = Joi.object().keys({
  lead_id: Joi.string().optional().trim(),
  sales_id: Joi.string().optional().trim(),
  product_id: Joi.string().optional().trim().allow('', null),
  offer_id: Joi.string().optional().trim().allow('', null),
  payment_id: Joi.string().optional().trim().allow('', null),
  item_type: Joi.string().valid('Product', 'Offer').optional(),
  status: Joi.string().valid('Pending', 'Approve', 'Reject').optional()
});