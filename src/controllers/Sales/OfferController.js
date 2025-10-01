import Offer from '../../models/modelschema/Offer.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewOffer = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    let offers = await Offer.find({
      start_date: { $lte: now },
      end_date: { $gte: now },
      isDeleted: false,
    })
    .populate({ path: 'product_id', select: 'name', match: { isDeleted: false } });
    offers = offers.map((item) => {
      return {
        name: item.name,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date,
        discount_type: item.discount_type,
        discount_amount: item.discount_amount,
        product_id: item?.product_id?.name ?? null,
      }
    });

    return res.status(200).json({ offers });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});