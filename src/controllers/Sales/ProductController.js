import Product from '../../models/modelschema/product.js'; 
import Offer from '../../models/modelschema/Offer.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewProduct = asyncHandler(async (req, res) => {
   const products = await Product.find({ isDeleted: false })
    .select('-isDeleted')
    .sort({ created_at: -1 })
  
    const offers = await Offer.find({
      isDeleted: false,
      product_id: { $in: products.map(p => p._id) }
    }).select('product_id name discount_type discount_amount start_date end_date');

    const productMap = products.map(product => {
      const offer = offers.find(o => o.product_id.toString() === product._id.toString());
      return {
        ...product.toObject(),
        offer: offer ? {
          name: offer.name,
          discount_type: offer.discount_type,
          discount_amount: offer.discount_amount,
          //format date as YYYY-MM-DD
          start_date: offer.start_date.toISOString().split('T')[0],
          end_date: offer.end_date.toISOString().split('T')[0],
        } : null
      };
    });

  return SuccessResponse(res, { 
    message: 'Products retrieved successfully', 
    data: productMap 
  }, 200);
});