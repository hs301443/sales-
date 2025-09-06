import Payment from '../../models/modelschema/payment.js';
import Lead from '../../models/modelschema/lead.js';
import User from '../../models/modelschema/User.js';
import Product from '../../models/modelschema/Product.js';
import Offer from '../../models/modelschema/Offer.js';
import PaymentMethod from '../../models/modelschema/PaymentMethod.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createPayment = asyncHandler(async (req, res) => {
  const {
    lead_id,
    sales_id,
    product_id,
    offer_id,
    payment_method_id,
    amount,
  } = req.body;

  // check lead_id is exist 
  const lead = await Lead.findById(lead_id);
  if (!lead) {
    return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
  }

  // check sales_id is exist
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // check product_id is exist
  const product = await Product.findById(product_id);
  if (!product) {
    return ErrorResponse(res, 400, { message: 'Invalid product_id' });
  }

  // check offer_id is exist
  const offer = await Offer.findById(offer_id);
  if (!offer) {
    return ErrorResponse(res, 400, { message: 'Invalid offer_id' });
  }

  // check payment_method_id is exist
  const paymentMethod = await PaymentMethod.findById(payment_method_id);
  if (!paymentMethod) {
    return ErrorResponse(res, 400, { message: 'Invalid payment_method_id' });
  }

  const payment = await Payment.create({
    lead_id,
    sales_id,
    product_id,
    offer_id,
    payment_method_id,
    amount,
  });

  return SuccessResponse(res, { message: 'Payment created successfully' }, 201);
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('lead_id', 'name')
    .populate('sales_id', 'name')
    .populate('product_id', 'name')
    .populate('offer_id', 'name')
    .populate('payment_method_id', 'name')
    .sort({ payment_date: -1 });

  return SuccessResponse(res, { message: 'Payments retrieved successfully', data: payments }, 200);
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payment = await Payment.findById(id)
    .populate('lead_id', 'name')
    .populate('sales_id', 'name')
    .populate('product_id', 'name')
    .populate('offer_id', 'name')
    .populate('payment_method_id', 'name');

  if (!payment) {
    throw new NotFound('Payment not found');
  }

  return SuccessResponse(res, { message: 'Payment retrieved successfully', data: payment }, 200);
});

export const updatePayment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payment = await Payment.findById(id);

  if (!payment) {
    throw new NotFound('Payment not found');
  }

  const {
    lead_id,
    sales_id,
    product_id,
    offer_id,
    payment_method_id,
    amount,
  } = req.body;

  payment.lead_id = lead_id || payment.lead_id;
  payment.sales_id = sales_id || payment.sales_id;
  payment.product_id = product_id || payment.product_id;
  payment.offer_id = offer_id || payment.offer_id;
  payment.payment_method_id = payment_method_id || payment.payment_method_id;
  payment.amount = amount || payment.amount;

  await payment.save();

  return SuccessResponse(res, { message: 'Payment updated successfully' }, 200);
});

export const deletePayment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payment = await Payment.findByIdAndRemove(id);

  if (!payment) {
    throw new NotFound('Payment not found');
  }

  return SuccessResponse(res, { message: 'Payment deleted successfully' }, 200);
});