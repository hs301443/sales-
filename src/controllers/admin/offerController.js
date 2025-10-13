import prisma from '../../lib/prisma.js';
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

  const product = await prisma.product.findUnique({ where: { id: Number(product_id) } });
  if (!product) throw new NotFound('Product not found');

  await prisma.offer.create({
    data: {
      name,
      description,
      // Assuming these exist in relational model; if not, remove
      // For now storing as optional fields in Offer model isn't defined; adjust schema if needed
      price: discount_amount ?? 0,
      status: 'Active',
      product_id: Number(product_id),
    },
  });

  return SuccessResponse(res, { message: 'Offer created successfully' }, 201);
});

export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await prisma.offer.findMany({
    where: { isDeleted: false },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      price: true,
      status: true,
      created_at: true,
      product: { select: { id: true, name: true, description: true } },
    }
  });

  return SuccessResponse(res, { message: 'Offers retrieved successfully', data: offers }, 200);
});

export const getOfferById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const offer = await prisma.offer.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      price: true,
      status: true,
      created_at: true,
      product: { select: { id: true, name: true, description: true } },
    }
  });

  if (!offer) throw new NotFound('Offer not found');

  return SuccessResponse(res, { message: 'Offer retrieved successfully', data: offer }, 200);
});

export const updateOffer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.offer.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Offer not found');

  const { name, description, discount_amount, status, product_id } = req.body;

  await prisma.offer.update({
    where: { id },
    data: {
      name: name ?? undefined,
      price: discount_amount ?? undefined,
      status: status ?? undefined,
      product_id: product_id ? Number(product_id) : undefined,
    }
  });

  return SuccessResponse(res, { message: 'Offer updated successfully' }, 200);
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const offer = await prisma.offer.findUnique({ where: { id } });
  if (!offer || offer.isDeleted) throw new NotFound('Offer not found');
  await prisma.offer.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Offer deleted successfully' }, 200);
});
