import Sales from '../../models/modelschema/sales.js';
import SalesPoint from '../../models/modelschema/salesPoint.js';
import { NotFound } from '../../Errors/NotFound.js'
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';


export const approveSale = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    // Find the sale by ID
    const sale = await Sales.findById(id)
      .populate('lead_id sales_id product_id offer_id payment_id');

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

    // Update sale status to approved
    sale.status = 'Approve';
    await sale.save();

    // Get current month and year
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const year = currentDate.getFullYear();

    // Check if salesperson already has points for this month/year
    const existingSalesPoint = await SalesPoint.findOne({
      sales_id: sale.sales_id,
      month: month,
      year: year
    });

    let salesPoint;

    if (existingSalesPoint) {
      // Update existing points
      existingSalesPoint.point += points;
      salesPoint = await existingSalesPoint.save();
    } else {
      // Create new sales point record
      salesPoint = new SalesPoint({
        point: points,
        month: month,
        year: year,
        sales_id: sale.sales_id
      });
      await salesPoint.save();
    }

    return SuccessResponse(res, {
      message: 'Sale approved successfully and points allocated',
      data: {
        sale: sale,
        salesPoint: salesPoint,
        pointsAwarded: points
      }
    }, 200);

  } catch (error) {
    console.error('Error approving sale:', error);
    ErrorResponse(res, 500, 'Internal server error');
  }
});