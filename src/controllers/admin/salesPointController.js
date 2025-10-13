import prisma from '../../lib/prisma.js';
import { NotFound } from '../../Errors/NotFound.js'
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';


export const approveSale = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    const sale = await prisma.sales.findUnique({ where: { id: Number(id) }, select: { id: true, status: true, sales_id: true } });

    if (!sale) {
      ErrorResponse(res, 404, 'Sale not found');
    }

    // Check if sale is already approved or rejected
    if (sale.status !== 'Pending') {
      ErrorResponse(res, 400, 'Sale is not pending');
    }

    // Validate points
    if (!points || points <= 0) {
      ErrorResponse(res, 400, 'Points must be a positive number');
    }

    await prisma.sales.update({ where: { id: Number(id) }, data: { status: 'Approve' } });

    // Get current month and year
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const year = currentDate.getFullYear();

    const existing = await prisma.salesPoint.findFirst({ where: { sales_id: sale.sales_id, month, year } });
    const salesPoint = existing
      ? await prisma.salesPoint.update({ where: { id: existing.id }, data: { point: existing.point + Number(points) } })
      : await prisma.salesPoint.create({ data: { sales_id: sale.sales_id, month, year, point: Number(points) } });

    return SuccessResponse(res, {
      message: 'Sale approved successfully and points allocated',
      data: {
        sale: { id: sale.id, status: 'Approve' },
        salesPoint: salesPoint,
        pointsAwarded: points
      }
    }, 200);

  } catch (error) {
    console.error('Error approving sale:', error);
    ErrorResponse(res, 500, 'Internal server error');
  }
});