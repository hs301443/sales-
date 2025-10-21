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

  const product = await prisma.product.findUnique({ 
    where: { id: Number(product_id) } 
  });
  if (!product) throw new NotFound('Product not found');

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  

  if (discount_type === 'percentage' && (discount_amount <= 0 || discount_amount > 100)) {
    throw new NotFound('Percentage discount must be between 0 and 100');
  }

  if (discount_type === 'fixed' && discount_amount <= 0) {
    throw new NotFound('Fixed discount must be greater than 0');
  }


  const existingOffer = await prisma.offer.findFirst({
    where: {
      product_id: Number(product_id),
      name: name,
      isDeleted: false
    }
  });

  if (existingOffer) {
    throw new NotFound('An offer with this name already exists for this product');
  }

  const offer = await prisma.offer.create({
    data: {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      discount_type,
      discount_amount: Number(discount_amount),
      subscription_details,
      setup_phase,
      product_id: Number(product_id),
      status: 'Active'
    },
  });

  return SuccessResponse(res, { 
    message: 'Offer created successfully',
    data: offer 
  }, 201);
});


export const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await prisma.offer.findMany({
    where: { isDeleted: false },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      description: true,
      discount_type: true,
      discount_amount: true,
      start_date: true,
      end_date: true,
      subscription_details: true,
      setup_phase: true,
      status: true,
      created_at: true,
      product: { 
        select: { 
          id: true, 
          name: true, 
          description: true 
        } 
      },
    }
  });

  return SuccessResponse(res, { 
    message: 'Offers retrieved successfully', 
    data: offers 
  }, 200);
});

export const getOfferById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const offer = await prisma.offer.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      description: true,
      discount_type: true,
      discount_amount: true,
      start_date: true,
      end_date: true,
      subscription_details: true,
      setup_phase: true,
      status: true,
      created_at: true,
      product: { 
        select: { 
          id: true, 
          name: true, 
          description: true 
        } 
      },
    }
  });

  if (!offer) throw new NotFound('Offer not found');

  return SuccessResponse(res, { 
    message: 'Offer retrieved successfully', 
    data: offer 
  }, 200);
});

export const updateOffer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.offer.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Offer not found');

  const {
    name,
    description,
    start_date,
    end_date,
    discount_type,
    discount_amount,
    subscription_details,
    setup_phase,
    status,
    product_id
  } = req.body;


  if (discount_type || discount_amount !== undefined) {
    const finalDiscountType = discount_type || existing.discount_type;
    const finalDiscountAmount = discount_amount !== undefined ? Number(discount_amount) : existing.discount_amount;

    if (finalDiscountType === 'percentage' && (finalDiscountAmount <= 0 || finalDiscountAmount > 100)) {
      throw new BadRequest('Percentage discount must be between 0 and 100');
    }

    if (finalDiscountType === 'value' && finalDiscountAmount <= 0) {
      throw new BadRequest('Fixed value discount must be greater than 0');
    }
  }


  if (name && name !== existing.name) {
    const duplicateOffer = await prisma.offer.findFirst({
      where: {
        product_id: product_id ? Number(product_id) : existing.product_id,
        name: name,
        id: { not: id },
        isDeleted: false
      }
    });

    if (duplicateOffer) {
      throw new BadRequest('An offer with this name already exists for this product');
    }
  }


  if (product_id) {
    const product = await prisma.product.findUnique({ 
      where: { id: Number(product_id) } 
    });
    if (!product) throw new NotFound('Product not found');
  }

  await prisma.offer.update({
    where: { id },
    data: {
      name: name ?? undefined,
      description: description ?? undefined,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      discount_type: discount_type ?? undefined,
      discount_amount: discount_amount !== undefined ? Number(discount_amount) : undefined,
      subscription_details: subscription_details ?? undefined,
      setup_phase: setup_phase ?? undefined,
      status: status ?? undefined,
      product_id: product_id ? Number(product_id) : undefined,
    }
  });

  return SuccessResponse(res, { 
    message: 'Offer updated successfully' 
  }, 200);
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const offer = await prisma.offer.findUnique({ where: { id } });
  if (!offer || offer.isDeleted) throw new NotFound('Offer not found');
  
  await prisma.offer.update({ 
    where: { id }, 
    data: { isDeleted: true } 
  });
  
  return SuccessResponse(res, { 
    message: 'Offer deleted successfully' 
  }, 200);
});