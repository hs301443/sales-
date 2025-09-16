import Payment from '../../models/modelschema/payment.js'; 
import Sales from '../../models/modelschema/sales.js'; 
import Product from '../../models/modelschema/Product.js'; 
import Offer from '../../models/modelschema/Offer.js'; 
import Lead from '../../models/modelschema/lead.js'; 
import PaymentMethod from '../../models/modelschema/PaymentMethod.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewPayment = asyncHandler(async (req, res) => {
  try {
    const sales_id = req.currentUser.id; 
    
    const [
      allSales,  
      products,
      offers,
      leads,
      payment_methods
    ] = await Promise.all([
      Sales.find({
        sales_id: sales_id,
        isDeleted: false,
      })  
      .sort({sale_date: -1})
      .populate({
        path: 'offer_id',
        match: { isDeleted: false },
        populate: { path: 'product_id', match: { isDeleted: false } }
      })
      .populate({ path: 'lead_id', select: 'name phone', match: { isDeleted: false } })
      .populate({ path: 'product_id', select: 'name', match: { isDeleted: false } })
      .populate({
        path: 'payment_id',
        match: { isDeleted: false },
        populate: { path: 'payment_method_id', select: 'name', match: { isDeleted: false } }
      })
      .lean(), 
      
      Product.find({status: true, isDeleted: false})
      .select('_id name')
      .lean(),
      
      Offer.find({status: true, isDeleted: false})
      .select('_id name')
      .lean(),
      
      Lead.find({status: {$in: ['intersted', 'negotiation', 'demo_request', 'demo_done']}, isDeleted: false})
      .select('_id name phone')
      .lean(),
      
      PaymentMethod.find({ isDeleted: false })
      .select('_id name')
      .lean()
    ]);

    const transformedSales = allSales.map((item) => {
      return {
        _id: item._id,
        lead_name: item?.lead_id?.name || 'N/A',
        lead_phone: item?.lead_id?.phone || 'N/A',
        product: item?.product_id?.name || item?.offer_id?.product_id?.name || 'N/A',
        offer: item?.offer_id?.name || 'N/A',
        payment_method: item?.payment_id?.payment_method_id?.name || 'N/A',
        amount: item?.payment_id?.amount || 0,
        status: item.status || 'Unknown',
        sale_date: item.sale_date || 'N/A'
      };
    });

    // Filter sales by status
    const pending = transformedSales.filter(sale => sale.status === 'Pending');
    const approve = transformedSales.filter(sale => sale.status === 'Approve');
    const reject = transformedSales.filter(sale => sale.status === 'Reject');

    return res.status(200).json({ 
      pending, 
      approve,
      reject
    });

  } catch (error) {
    console.error('Error in viewPayment:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 500,
        message: 'Internal server error',
        details: error.message
      }
    });
  }
});

export const addPayment = asyncHandler(async (req, res) => {
  try { 
      // sales_id
    const {lead_id, product_id, offer_id, payment_method_id, amount, item_type} = req.body;
    const userId = req.currentUser.id;
    const payment = await Payment.create({
      lead_id,
      sales_id: userId,
      product_id,
      offer_id,
      payment_method_id,
      amount,
    });
    await Sales.create({
      lead_id,
      sales_id: userId,
      product_id,
      offer_id,
      payment_id: payment._id,
      item_type,
      offer_id,
    });

    return res.status(200).json({ 'success' : 'You add payment success' });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
}); 