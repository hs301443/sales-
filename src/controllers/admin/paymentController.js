import prisma from '../../lib/prisma.js';
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

  const lead = await prisma.lead.findUnique({ where: { id: Number(lead_id) } });
  if (!lead) return ErrorResponse(res, 400, { message: 'Invalid lead_id' });

  const sales = await prisma.user.findUnique({ where: { id: Number(sales_id) } });
  if (!sales || sales.role !== 'Salesman') return ErrorResponse(res, 400, { message: 'Invalid sales_id' });

  const product = await prisma.product.findUnique({ where: { id: Number(product_id) } });
  if (!product) return ErrorResponse(res, 400, { message: 'Invalid product_id' });

  const offer = await prisma.offer.findUnique({ where: { id: Number(offer_id) } });
  if (!offer) return ErrorResponse(res, 400, { message: 'Invalid offer_id' });

  const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id: Number(payment_method_id) } });
  if (!paymentMethod) return ErrorResponse(res, 400, { message: 'Invalid payment_method_id' });

  await prisma.payment.create({
    data: {
      amount: Number(amount),
      payment_method_id: Number(payment_method_id),
    }
  });

  // Optionally associate sale row
  await prisma.sales.create({
    data: {
      lead_id: Number(lead_id),
      sales_id: Number(sales_id),
      product_id: Number(product_id),
      offer_id: Number(offer_id),
      payment_id: (await prisma.payment.findFirst({ orderBy: { id: 'desc' } }))?.id,
    }
  });

  return SuccessResponse(res, { message: 'Payment created successfully' }, 201);
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { isDeleted: false },
    orderBy: { payment_date: 'desc' },
    select: {
      id: true,
      amount: true,
      payment_date: true,
      method: { select: { id: true, name: true } },
      sales: {
        select: {
          id: true,
          lead: { select: { id: true, name: true } },
          salesUser: { select: { id: true, name: true, email: true } },
          product: { select: { id: true, name: true } },
          offer: { select: { id: true, name: true } },
        }
      }
    }
  });

  const [leads, sales, products, offers, paymentMethods] = await Promise.all([
    prisma.lead.findMany({ where: { isDeleted: false }, select: { id: true, name: true, phone: true } }),
    prisma.user.findMany({ where: { isDeleted: false }, select: { id: true, name: true, email: true } }),
    prisma.product.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
    prisma.offer.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
    prisma.paymentMethod.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
  ]);

  return SuccessResponse(res, { message: 'Payments retrieved successfully', data: {
    payments,
    LeadOptions: leads,
    SalesOptions: sales,
    ProductOptions: products,
    OfferOptions: offers,
    PayementMethodOptions: paymentMethods 
  } }, 200);
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const payment = await prisma.payment.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      amount: true,
      payment_date: true,
      method: { select: { id: true, name: true } },
      sales: {
        select: {
          id: true,
          lead: { select: { id: true, name: true } },
          salesUser: { select: { id: true, name: true } },
          product: { select: { id: true, name: true } },
          offer: { select: { id: true, name: true } },
        }
      }
    }
  });

  if (!payment) throw new NotFound('Payment not found');
  return SuccessResponse(res, { message: 'Payment retrieved successfully', data: payment }, 200);
});

export const updatePayment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Payment not found');

  const { payment_method_id, amount } = req.body;

  await prisma.payment.update({
    where: { id },
    data: {
      payment_method_id: payment_method_id ? Number(payment_method_id) : undefined,
      amount: amount !== undefined ? Number(amount) : undefined,
    }
  });

  return SuccessResponse(res, { message: 'Payment updated successfully' }, 200);
});

export const deletePayment = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment || payment.isDeleted) throw new NotFound('Payment not found');
  await prisma.payment.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Payment deleted successfully' }, 200);
});