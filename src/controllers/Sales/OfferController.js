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
    .populate({ path: 'product_id', select: 'name subscription_type price setup_fees', match: { isDeleted: false } });
    offers = offers.map((item) => {
      return {
        name: item.name,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date,
        discount_type: item.discount_type,
        discount_amount: item.discount_amount,
        subscription_details: item.subscription_details,
        setup_phase: item.setup_phase,
        product_name: item?.product_id?.name ?? null,
        product_subscription_type: item?.product_id?.subscription_type ?? null,
        product_price: item?.product_id?.price ?? 0,
        product_setup_fees: item?.product_id?.setup_fees ?? 0,
      }
    });

    return res.status(200).json({ offers });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});