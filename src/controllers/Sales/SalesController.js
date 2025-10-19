import prisma from '../../lib/prisma.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewSales = asyncHandler(async (req, res) => {
  try {
    const sales = await prisma.sales.findMany({ where: { isDeleted: false }, orderBy: { sale_date: 'desc' } });
    return res.status(200).json({ sales });
  } catch (error) {
    return ErrorResponse(res, 400 ,error.message);
  }
});