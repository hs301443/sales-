import Lead from '../../models/modelschema/Lead.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const leads = await Lead.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "sales_id",
        foreignField: "_id",
        as: "sales"
      }
    },
    { $unwind: "$sales" },
    {
      $lookup: {
        from: "users",
        localField: "sales.leader_id",
        foreignField: "_id",
        as: "leader"
      }
    },
    { $unwind: "$leader" },
    {
      $match: {
        "leader.id": userId
      }
    }
  ]);

    return res.status(200).json({ leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});