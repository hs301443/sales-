import prisma from '../../lib/prisma.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewOffer = asyncHandler(async (req, res) => {
  try {
    const offers = await prisma.offer.findMany({
      where: { 
        isDeleted: false
      },
      select: {
        id: true,
        name: true,
        description: true,
        discount_type: true,
        discount_amount: true,
        start_date: true,
        end_date: true,
        subscription_details: true,
        setup_phase: true,
        status: true,
        created_at: true,
        product: { 
          select: { 
            id: true,
            name: true, 
            description: true,
            subscription_type: true, 
            price: true, 
            setup_fees: true,
            status: true
          } 
        },
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return res.status(200).json({ 
      success: true,
      message: 'All offers retrieved successfully',
      data: offers 
    });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});