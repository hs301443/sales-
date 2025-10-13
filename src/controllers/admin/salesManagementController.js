import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createSale = asyncHandler(async (req, res) => {
  let {
    lead_id,
    sales_id,
    product_id,
    offer_id,
    item_type,
    status
  } = req.body;

  const lead = await prisma.lead.findUnique({ where: { id: Number(lead_id) } });
  if (!lead) return ErrorResponse(res, 400, { message: 'Invalid lead_id' });

  const sales = await prisma.user.findUnique({ where: { id: Number(sales_id) } });
  if (!sales || sales.role !== 'Salesman') return ErrorResponse(res, 400, { message: 'Invalid sales_id' });

  // Validate item_type and corresponding ID
  if (item_type === 'Product') {
    const product = await prisma.product.findUnique({ where: { id: Number(product_id) } });
    if (!product) return ErrorResponse(res, 400, { message: 'Invalid product_id' });
    // Clear offer_id if product is selected
    offer_id = null;
  } else if (item_type === 'Offer') {
    const offer = await prisma.offer.findUnique({ where: { id: Number(offer_id) } });
    if (!offer) return ErrorResponse(res, 400, { message: 'Invalid offer_id' });
    // Clear product_id if offer is selected
    product_id = null;
  } else {
    return ErrorResponse(res, 400, { message: 'Invalid item_type' });
  }

  const sale = await prisma.sales.create({
    data: {
      lead_id: Number(lead_id),
      sales_id: Number(sales_id),
      product_id: product_id ? Number(product_id) : null,
      offer_id: offer_id ? Number(offer_id) : null,
      item_type,
      status: status || 'Pending',
    }
  });

  return SuccessResponse(res, { message: 'Sale created successfully', data: sale }, 201);
});

export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await prisma.sales.findMany({
    where: { isDeleted: false },
    orderBy: { sale_date: 'desc' },
    select: {
      id: true,
      sale_date: true,
      status: true,
      item_type: true,
      lead: { select: { id: true, name: true } },
      salesUser: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
      offer: { select: { id: true, name: true } },
      payment: { select: { id: true, amount: true, payment_date: true } },
    }
  });

  const [leadOptions, salesOptions, productOptions, offerOptions, paymentOptions] = await Promise.all([
    prisma.lead.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { role: 'Salesman', isDeleted: false }, select: { id: true, name: true } }),
    prisma.product.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
    prisma.offer.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
    prisma.payment.findMany({ where: { isDeleted: false }, select: { id: true, amount: true, payment_date: true } }),
  ]);

  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: { sales, leadOptions, salesOptions, productOptions, offerOptions, paymentOptions } }, 200);
});

export const getSaleById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const sale = await prisma.sales.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      sale_date: true,
      status: true,
      item_type: true,
      lead: { select: { id: true, name: true, email: true, phone: true } },
      salesUser: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, price: true, description: true } },
      offer: { select: { id: true, name: true, price: true, description: true } },
      payment: { select: { id: true, amount: true, payment_date: true, method: { select: { id: true } } } },
    }
  });
  if (!sale) throw new NotFound('Sale not found');
  return SuccessResponse(res, { message: 'Sale retrieved successfully', data: sale }, 200);
});

export const updateSale = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const sale = await prisma.sales.findUnique({ where: { id } });

  if (!sale) {
    throw new NotFound('Sale not found');
  }

  let {
    lead_id,
    sales_id,
    product_id,
    offer_id,
    payment_id,
    item_type,
    status
  } = req.body;

  // Validate references if provided
  const data = {};
  if (lead_id) {
    const lead = await prisma.lead.findUnique({ where: { id: Number(lead_id) } });
    if (!lead) return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
    data.lead_id = Number(lead_id);
  }

  if (sales_id) {
    const salesUser = await prisma.user.findUnique({ where: { id: Number(sales_id) } });
    if (!salesUser || salesUser.role !== 'Salesman') return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
    data.sales_id = Number(sales_id);
  }

  if (item_type) {
    if (item_type === 'Product' && product_id) {
      const product = await prisma.product.findUnique({ where: { id: Number(product_id) } });
      if (!product) return ErrorResponse(res, 400, { message: 'Invalid product_id' });
      data.product_id = Number(product_id);
      data.offer_id = null;
    } else if (item_type === 'Offer' && offer_id) {
      const offer = await prisma.offer.findUnique({ where: { id: Number(offer_id) } });
      if (!offer) return ErrorResponse(res, 400, { message: 'Invalid offer_id' });
      data.offer_id = Number(offer_id);
      data.product_id = null;
    } else {
      return ErrorResponse(res, 400, { message: 'Invalid item_type' });
    }
    data.item_type = item_type;
  }

  if (payment_id) data.payment_id = Number(payment_id);

  if (status) data.status = status;

  await prisma.sales.update({ where: { id }, data });

  return SuccessResponse(res, { message: 'Sale updated successfully', data: sale }, 200);
});

export const deleteSale = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const sale = await prisma.sales.findUnique({ where: { id } });

  if (!sale || sale.isDeleted) {
    throw new NotFound('Sale not found');
  }

  await prisma.sales.update({ where: { id }, data: { isDeleted: true } });

  return SuccessResponse(res, { message: 'Sale deleted successfully' }, 200);
});

export const getSalesByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  if (!['Pending', 'Approve', 'Reject'].includes(status)) {
    return ErrorResponse(res, 400, { message: 'Invalid status' });
  }

  const sales = await prisma.sales.findMany({
    where: { status, isDeleted: false },
    orderBy: { sale_date: 'desc' },
    select: {
      id: true,
      sale_date: true,
      status: true,
      lead: { select: { id: true, name: true } },
      salesUser: { select: { id: true, name: true } },
      product: { select: { id: true, name: true } },
      offer: { select: { id: true, name: true } },
    }
  });

  return SuccessResponse(res, { 
    message: `Sales with status ${status} retrieved successfully`, 
    data: sales 
  }, 200);
});

export const getSalesBySalesman = asyncHandler(async (req, res) => {
  const { sales_id } = req.params;

  const salesman = await prisma.user.findUnique({ where: { id: Number(sales_id) } });
  if (!salesman || salesman.role !== 'Salesman') return ErrorResponse(res, 400, { message: 'Invalid sales_id' });

  const sales = await prisma.sales.findMany({
    where: { sales_id: Number(sales_id), isDeleted: false },
    orderBy: { sale_date: 'desc' },
    select: {
      id: true,
      sale_date: true,
      status: true,
      lead: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, price: true } },
      offer: { select: { id: true, name: true, price: true } },
      payment: { select: { id: true, amount: true, payment_date: true } },
    }
  });

  return SuccessResponse(res, { 
    message: `Sales for salesman ${salesman.name} retrieved successfully`, 
    data: sales 
  }, 200);
});