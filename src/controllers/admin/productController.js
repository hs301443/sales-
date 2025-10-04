import Product from '../../models/modelschema/product.js';
import Offer from '../../models/modelschema/Offer.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    subscription_type,
    price,
    setup_fees,
    status,
  } = req.body;


  if (!['Monthly', 'Quarterly', 'Half year', 'Yearly'].includes(subscription_type)) {
    return ErrorResponse(res, 400, { message: 'Invalid subscription type' });
  }

  const product = await Product.create({
    name,
    description,
    subscription_type,
    price: price || 0,
    setup_fees: setup_fees || 0,
    status: status !== undefined ? status : true,
  });

  return SuccessResponse(res, { 
    message: 'Product created successfully',
    data: product 
  }, 201);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isDeleted: false })
    .select('-isDeleted')
    .sort({ created_at: -1 });

  return SuccessResponse(res, { 
    message: 'Products retrieved successfully', 
    data: products 
  }, 200);
});

export const getProductById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOne({ _id: id, isDeleted: false }).select('-isDeleted');

  if (!product) {
    throw new NotFound('Product not found');
  }

  return SuccessResponse(res, { 
    message: 'Product retrieved successfully', 
    data: product 
  }, 200);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (!product || product.isDeleted) {
    throw new NotFound('Product not found');
  }

  const {
    name,
    description,
    subscription_type,
    price,
    setup_fees,
    status,
  } = req.body;

  // Validate subscription_type if provided
  if (subscription_type && !['Monthly', 'Quarterly', 'Half year', 'Yearly'].includes(subscription_type)) {
    return ErrorResponse(res, 400, { message: 'Invalid subscription type' });
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.subscription_type = subscription_type || product.subscription_type;
  product.price = price !== undefined ? price : product.price;
  product.setup_fees = setup_fees !== undefined ? setup_fees : product.setup_fees;
  product.status = status !== undefined ? status : product.status;

  await product.save();

  return SuccessResponse(res, { 
    message: 'Product updated successfully',
    data: product 
  }, 200);
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

  return SuccessResponse(res, { 
    message: 'Product and its associated offers deleted successfully' 
  }, 200);
});

// Get products by subscription type
export const getProductsBySubscriptionType = asyncHandler(async (req, res) => {
  const { subscription_type } = req.params;
  
  if (!['Monthly', 'Quarterly', 'Half year', 'Yearly'].includes(subscription_type)) {
    return ErrorResponse(res, 400, { message: 'Invalid subscription type' });
  }

  const products = await Product.find({ 
    subscription_type,
    isDeleted: false,
    status: true 
  }).select('-isDeleted').sort({ created_at: -1 });

  return SuccessResponse(res, { 
    message: `Products with ${subscription_type} subscription retrieved successfully`, 
    data: products 
  }, 200);
});