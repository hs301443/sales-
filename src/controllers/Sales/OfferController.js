import prisma from '../../lib/prisma.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewOffer = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        product: { select: { name: true, subscription_type: true, price: true, setup_fees: true } },
      }
    });

    return res.status(200).json({ offers });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});