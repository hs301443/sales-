import Product from '../../models/modelschema/product.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({status: true})
    .select('name description price_month price_quarter price_year setup_fees')

    return res.status(200).json({ products });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});