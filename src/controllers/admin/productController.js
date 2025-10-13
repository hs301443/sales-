import prisma from '../../lib/prisma.js';
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

  const product = await prisma.product.create({
    data: {
      name,
      description,
      subscription_type,
      price: price ? Number(price) : 0,
      setup_fees: setup_fees ? Number(setup_fees) : 0,
      status: status !== undefined ? Boolean(status) : true,
    }
  });

  return SuccessResponse(res, { message: 'Product created successfully', data: product }, 201);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({ where: { isDeleted: false }, orderBy: { created_at: 'desc' } });
  return SuccessResponse(res, { message: 'Products retrieved successfully', data: products }, 200);
});

export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findFirst({ where: { id, isDeleted: false } });
  if (!product) throw new NotFound('Product not found');
  return SuccessResponse(res, { message: 'Product retrieved successfully', data: product }, 200);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Product not found');

  const { name, description, subscription_type, price, setup_fees, status } = req.body;
  if (subscription_type && !['Monthly', 'Quarterly', 'Half year', 'Yearly'].includes(subscription_type)) {
    return ErrorResponse(res, 400, { message: 'Invalid subscription type' });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: name ?? undefined,
      description: description ?? undefined,
      subscription_type: subscription_type ?? undefined,
      price: price !== undefined ? Number(price) : undefined,
      setup_fees: setup_fees !== undefined ? Number(setup_fees) : undefined,
      status: status !== undefined ? Boolean(status) : undefined,
    }
  });

  return SuccessResponse(res, { message: 'Product updated successfully', data: product }, 200);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Product not found');
  await prisma.product.update({ where: { id }, data: { isDeleted: true } });
  await prisma.offer.updateMany({ where: { product_id: id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Product and its associated offers deleted successfully' }, 200);
});

// Get products by subscription type
export const getProductsBySubscriptionType = asyncHandler(async (req, res) => {
  const { subscription_type } = req.params;
  
  if (!['Monthly', 'Quarterly', 'Half year', 'Yearly'].includes(subscription_type)) {
    return ErrorResponse(res, 400, { message: 'Invalid subscription type' });
  }

  const products = await prisma.product.findMany({ 
    where: { subscription_type, isDeleted: false, status: true },
    orderBy: { created_at: 'desc' }
  });

  return SuccessResponse(res, { message: `Products with ${subscription_type} subscription retrieved successfully`, data: products }, 200);
});