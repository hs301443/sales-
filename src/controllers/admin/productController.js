import Product from '../../models/modelschema/Product.js';
import Offer from '../../models/modelschema/Offer.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price_month,
    price_quarter,
    price_year,
    setup_fees,
    status,
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price_month: price_month || 0,
    price_quarter: price_quarter || 0,
    price_year: price_year || 0,
    setup_fees: setup_fees || 0,
    status: status || true,
  });

  return SuccessResponse(res, { message: 'Product created successfully' }, 201);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isDeleted: false })
    .select('-isDeleted')
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Products retrieved successfully', data: products }, 200);
});

export const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id, isDeleted: false }).select('-isDeleted');

  if (!product) {
    throw new NotFound('Product not found');
  }

  return SuccessResponse(res, { message: 'Product retrieved successfully', data: product }, 200);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product) {
    throw new NotFound('Product not found');
  }

  const {
    name,
    description,
    price_month,
    price_quarter,
    price_year,
    setup_fees,
    status,
  } = req.body;

  product.name = name || product.name;
  product.description = description || product.description;
  product.price_month = price_month || product.price_month;
  product.price_quarter = price_quarter || product.price_quarter;
  product.price_year = price_year || product.price_year;
  product.setup_fees = setup_fees || product.setup_fees;
  product.status = status || product.status;

  await product.save();

  return SuccessResponse(res, { message: 'Product updated successfully' }, 200);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  
  // First find the product to ensure it exists
  const product = await Product.findById(id);
  
  if (!product || product.isDeleted) {
    throw new NotFound('Product not found');
  }

  // Soft-delete product and its offers
  product.isDeleted = true;
  await product.save();
  await Offer.updateMany({ product_id: id }, { $set: { isDeleted: true } });

  return SuccessResponse(res, { message: 'Product and its associated offers deleted successfully' }, 200);
});