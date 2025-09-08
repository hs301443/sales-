import Payment from '../../models/modelschema/payment.js'; 
import Sales from '../../models/modelschema/sales.js'; 
import Product from '../../models/modelschema/product.js'; 
import Offer from '../../models/modelschema/Offer.js'; 
import Lead from '../../models/modelschema/lead.js'; 
import PaymentMethod from '../../models/modelschema/paymentmethod.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewPayment = asyncHandler(async (req, res) => {
  try {
    const pendingSales = Sales.find({
      status: 'Pending'
    })
    .sort({sale_date: -1})
    .populate({
      path: 'offer_id',
      populate: 'product_id'
    })
    .populate('lead_id')
    .populate('payment_method_id')
    .populate('product_id');
    pendingSales = (await pendingSales).map((item) => {
      return {
        lead_name : item?.lead_id?.name,
        lead_phone : item?.lead_id?.phone,
        product : item?.product_id?.name ?? item?.offer_id?.product_id?.name,
        offer : item?.offer_id?.name,
        payment_method : item?.payment_id?.payment_method_id?.name,
        amount : item?.amount,
        status: item.status
      }
    });
    const products = Product.find({status: true})
    .select('_id name');
    const offers = Offer.find({status: true})
    .select('_id name');
    const leads = Lead.find({$in: ['intersted', 'negotiation', 'demo_request', 'demo_done']})
    .select('_id name phone');
    const payment_methodes = PaymentMethod.find()
    .select('_id name');
    
    const pending = pendingSales.filter(sale => sale.status === 'Pending');
    const history = pendingSales.filter(sale => sale.status !== 'Pending');

    return res.status(200).json({ pending, history, products, offers, leads, payment_methodes });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
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