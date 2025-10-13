import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewProduct = asyncHandler(async (req, res) => {
   const products = await prisma.product.findMany({
     where: { status: true, isDeleted: false },
     orderBy: { created_at: 'desc' },
     select: {
       id: true,
       name: true,
       description: true,
       subscription_type: true,
       price: true,
       setup_fees: true,
       status: true,
       created_at: true,
       offers: {
         where: { isDeleted: false },
         orderBy: { created_at: 'desc' },
         take: 1,
         select: { id: true, name: true, price: true, created_at: true },
       }
     }
   });

   const mapped = products.map(p => ({
     ...p,
     offer: p.offers[0] ? {
       name: p.offers[0].name,
       discount_type: 'amount',
       discount_amount: p.offers[0].price,
       start_date: p.offers[0].created_at.toISOString().split('T')[0],
       end_date: p.offers[0].created_at.toISOString().split('T')[0],
     } : null
   }));

  return SuccessResponse(res, { 
    message: 'Products retrieved successfully', 
    data: mapped 
  }, 200);
});