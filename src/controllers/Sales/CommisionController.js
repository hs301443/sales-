import Commission from '../../models/modelschema/commision.js';
import SalesPoint from '../../models/modelschema/salesPoint.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewHome = asyncHandler(async (req, res) => {
  try {
    const sales_id = req.currentUser.id;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const my_points = SalesPoint
    .findOne({
      month, year, sales_id
    });

    const commissions = await Commission.find();
    commissions = commissions.map(item => {
      return {
        ...item.toObject(),
        my_level: item.point_threshold <= my_points
      };
    });
    return res.status(200).json({ commisions });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});