import Offer from '../../models/modelschema/Offer.js';
import Product from '../../models/modelschema/Product.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createOffer = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    start_date,
    end_date,
    discount_type,
    discount_amount,
    subscription_details,
    setup_phase,
    product_id,
  } = req.body;

  const product = await Product.findById(product_id);
  if (!product) {
    throw new NotFound('Product not found');
  }

  const offer = await Offer.create({
    name,
    description,
    start_date,
    end_date,
    discount_type,
    discount_amount,
    subscription_details,
    setup_phase,
    product_id,
  });

  return SuccessResponse(res, { message: 'Offer created successfully' }, 201);
});

export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find()
    .sort({ created_at: -1 })
    .populate('product_id');

  return SuccessResponse(res, { message: 'Offers retrieved successfully', data: offers }, 200);
});

export const getOfferById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const offer = await Offer.findById(id).populate('product_id');

  if (!offer) {
    throw new NotFound('Offer not found');
  }

  return SuccessResponse(res, { message: 'Offer retrieved successfully', data: offer }, 200);
});

export const updateOffer = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const offer = await Offer.findById(id);

  if (!offer) {
    throw new NotFound('Offer not found');
  }

  const {
    name,
    description,
    start_date,
    end_date,
    discount_type,
    discount_amount,
    subscription_details,
    setup_phase,
    product_id,
  } = req.body;

  offer.name = name || offer.name;
  offer.description = description || offer.description;
  offer.start_date = start_date || offer.start_date;
  offer.end_date = end_date || offer.end_date;
  offer.discount_type = discount_type || offer.discount_type;
  offer.discount_amount = discount_amount || offer.discount_amount;
  offer.subscription_details = subscription_details || offer.subscription_details;
  offer.setup_phase = setup_phase || offer.setup_phase;
  offer.product_id = product_id || offer.product_id;

  await offer.save();

  return SuccessResponse(res, { message: 'Offer updated successfully' }, 200);
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const offer = await Offer.findByIdAndRemove(id);

  if (!offer) {
    throw new NotFound('Offer not found');
  }

  return SuccessResponse(res, { message: 'Offer deleted successfully' }, 200);
});
