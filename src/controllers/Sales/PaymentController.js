import prisma from '../../lib/prisma.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { saveBase64Image } from '../../utils/handleImages.js';

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
      prisma.sales.findMany({
        where: { sales_id: Number(sales_id), isDeleted: false },
        orderBy: { sale_date: 'desc' },
        select: {
          id: true,
          sale_date: true,
          status: true,
          lead: { select: { id: true, name: true, phone: true } },
          product: { select: { id: true, name: true } },
          offer: { select: { id: true, name: true, product: { select: { id: true, name: true } } } },
          payment: { select: { id: true, amount: true, proof_image: true, method: { select: { id: true, name: true } } } },
        }
      }), 
      
      prisma.product.findMany({ where: { status: true, isDeleted: false }, select: { id: true, name: true } }),
      prisma.offer.findMany({ where: { isDeleted: false }, select: { id: true, name: true } }),
      prisma.lead.findMany({ where: { status: { in: ['intersted','negotiation','demo_request','demo_done'] }, isDeleted: false }, select: { id: true, name: true, phone: true } }),
      prisma.paymentMethod.findMany({ where: { isDeleted: false }, select: { id: true, name: true } })
    ]);

    const transformedSales = allSales.map((item) => {
      return {
        _id: item.id, // Changed from item._id to item.id
        lead_name: item.lead?.name || 'N/A', // Changed from item.lead_id to item.lead
        lead_phone: item.lead?.phone || 'N/A', // Changed from item.lead_id to item.lead
        product: item.product?.name || item.offer?.product?.name || 'N/A', // Fixed nested access
        offer: item.offer?.name || 'N/A', // Changed from item.offer_id to item.offer
        payment_method: item.payment?.method?.name || 'N/A', // Fixed nested access
        amount: item.payment?.amount || 0,
        proof_image: item.payment?.proof_image || 'N/A',
        status: item.status || 'Unknown',
        sale_date: item.sale_date || 'N/A'
      };
    });

    //lead options
    const leadOptions = leads.map((lead) => ({ value: lead.id, label: lead.name }));

    //product options
    const productOptions = products.map((product) => ({ value: product.id, label: product.name }));

    //offer options
    const offerOptions = offers.map((offer) => ({ value: offer.id, label: offer.name }));

    // payment method 
    const paymentMethodOptions = payment_methods.map((pm) => ({ value: pm.id, label: pm.name }));

    // Filter sales by status
    const pending = transformedSales.filter(sale => sale.status === 'Pending');
    const approve = transformedSales.filter(sale => sale.status === 'Approve');
    const reject = transformedSales.filter(sale => sale.status === 'Reject');

    return res.status(200).json({ 
      pending, 
      approve,
      reject,
      leadOptions,
      productOptions,
      offerOptions,
      paymentMethodOptions
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
    const {lead_id, product_id, offer_id, payment_method_id, amount, proof_image} = req.body;
    const userId = req.currentUser.id;
    const base64 = req.body.proof_image;
    const folder = 'payments';
    const imageUrl = await saveBase64Image(base64, userId, req, folder);

    const lead = await prisma.lead.findUnique({ where: { id: Number(lead_id) } });
    if (!lead) return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
    const product = await prisma.product.findUnique({ where: { id: Number(product_id) } });
    if (!product) return ErrorResponse(res, 400, { message: 'Invalid product_id' });
    const offer = await prisma.offer.findUnique({ where: { id: Number(offer_id) } });
    if (!offer) return ErrorResponse(res, 400, { message: 'Invalid offer_id' });
    const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id: Number(payment_method_id) } });
    if (!paymentMethod) return ErrorResponse(res, 400, { message: 'Invalid payment_method_id' });

    
    const payment = await prisma.payment.create({ data: { amount: Number(amount), payment_method_id: Number(payment_method_id), proof_image: imageUrl } });
    await prisma.sales.create({ data: { lead_id: Number(lead_id), sales_id: Number(userId), product_id: Number(product_id), offer_id: Number(offer_id), payment_id: payment.id, item_type:'Product' } });

    return res.status(200).json({ 'success' : 'You add payment success' });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
}); 