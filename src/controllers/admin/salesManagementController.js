import Sales from '../../models/modelschema/sales.js';
import Lead from '../../models/modelschema/lead.js';
import User from '../../models/modelschema/User.js';
import Product from '../../models/modelschema/Product.js';
import Offer from '../../models/modelschema/Offer.js';
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

  // Check lead_id exists
  const lead = await Lead.findById(lead_id);
  if (!lead) {
    return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
  }

  // Check sales_id exists and is a Salesman
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // Validate item_type and corresponding ID
  if (item_type === 'Product') {
    const product = await Product.findById(product_id);
    if (!product) {
      return ErrorResponse(res, 400, { message: 'Invalid product_id' });
    }
    // Clear offer_id if product is selected
    offer_id = null;
  } else if (item_type === 'Offer') {
    const offer = await Offer.findById(offer_id);
    if (!offer) {
      return ErrorResponse(res, 400, { message: 'Invalid offer_id' });
    }
    // Clear product_id if offer is selected
    product_id = null;
  } else {
    return ErrorResponse(res, 400, { message: 'Invalid item_type' });
  }

  const sale = await Sales.create({
    lead_id,
    sales_id,
    product_id,
    offer_id,
    item_type,
    status
  });

  return SuccessResponse(res, { message: 'Sale created successfully', data: sale }, 201);
});

export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await Sales.find({ isDeleted: false })
    .select('-isDeleted')
    .populate({ path: 'lead_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'product_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'offer_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'payment_id', select: 'amount payment_date', match: { isDeleted: false } })
    .sort({ sale_date: -1 });

  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: sales }, 200);
});

export const getSaleById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sale = await Sales.findOne({ _id: id, isDeleted: false })
    .select('-isDeleted')
    .populate({ path: 'lead_id', select: 'name email phone', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name email', match: { isDeleted: false } })
    .populate({ path: 'product_id', select: 'name price description', match: { isDeleted: false } })
    .populate({ path: 'offer_id', select: 'name price description', match: { isDeleted: false } })
    .populate({ path: 'payment_id', select: 'amount payment_date payment_method_id', match: { isDeleted: false } });

  if (!sale) {
    throw new NotFound('Sale not found');
  }

  return SuccessResponse(res, { message: 'Sale retrieved successfully', data: sale }, 200);
});

export const updateSale = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sale = await Sales.findById(id);

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
  if (lead_id) {
    const lead = await Lead.findById(lead_id);
    if (!lead) {
      return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
    }
    sale.lead_id = lead_id;
  }

  if (sales_id) {
    const salesUser = await User.findById(sales_id);
    if (!salesUser || salesUser.role !== 'Salesman') {
      return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
    }
    sale.sales_id = sales_id;
  }

  if (item_type) {
    if (item_type === 'Product' && product_id) {
      const product = await Product.findById(product_id);
      if (!product) {
        return ErrorResponse(res, 400, { message: 'Invalid product_id' });
      }
      sale.product_id = product_id;
      sale.offer_id = null;
    } else if (item_type === 'Offer' && offer_id) {
      const offer = await Offer.findById(offer_id);
      if (!offer) {
        return ErrorResponse(res, 400, { message: 'Invalid offer_id' });
      }
      sale.offer_id = offer_id;
      sale.product_id = null;
    } else {
      return ErrorResponse(res, 400, { message: 'Invalid item_type' });
    }
    sale.item_type = item_type;
  }

  if (payment_id) {
    sale.payment_id = payment_id;
  }

  if (status) {
    sale.status = status;
  }

  await sale.save();

  return SuccessResponse(res, { message: 'Sale updated successfully', data: sale }, 200);
});

export const deleteSale = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sale = await Sales.findById(id);

  if (!sale || sale.isDeleted) {
    throw new NotFound('Sale not found');
  }

  sale.isDeleted = true;
  await sale.save();

  return SuccessResponse(res, { message: 'Sale deleted successfully' }, 200);
});

export const getSalesByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  if (!['Pending', 'Approve', 'Reject'].includes(status)) {
    return ErrorResponse(res, 400, { message: 'Invalid status' });
  }

  const sales = await Sales.find({ status, isDeleted: false })
    .select('-isDeleted')
    .populate({ path: 'lead_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'product_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'offer_id', select: 'name', match: { isDeleted: false } })
    .sort({ sale_date: -1 });

  return SuccessResponse(res, { 
    message: `Sales with status ${status} retrieved successfully`, 
    data: sales 
  }, 200);
});

export const getSalesBySalesman = asyncHandler(async (req, res) => {
  const { sales_id } = req.params;

  // Validate salesman exists
  const salesman = await User.findById(sales_id);
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  const sales = await Sales.find({ sales_id, isDeleted: false })
    .select('-isDeleted')
    .populate({ path: 'lead_id', select: 'name email', match: { isDeleted: false } })
    .populate({ path: 'product_id', select: 'name price', match: { isDeleted: false } })
    .populate({ path: 'offer_id', select: 'name price', match: { isDeleted: false } })
    .populate({ path: 'payment_id', select: 'amount payment_date', match: { isDeleted: false } })
    .sort({ sale_date: -1 });

  return SuccessResponse(res, { 
    message: `Sales for salesman ${salesman.name} retrieved successfully`, 
    data: sales 
  }, 200);
});