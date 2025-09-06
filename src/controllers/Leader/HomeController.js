import User from '../../models/modelschema/User.js';
import SalesPoint from '../../models/modelschema/salesPoint.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import mongoose from 'mongoose';

export const viewHome = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
   
    const { month, year } = req.query;
    const target = await User.aggregate([
      { $match: { leader_id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "targets",
          localField: "target_id",
          foreignField: "_id",
          as: "target"
        }
      },
      { $unwind: "$target" },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: "$target.point" }
        }
      }
    ]);

    const total_target = target.length > 0 ? target[0].totalPoints : 0;
        const salesResult = await SalesPoint.aggregate([
      { 
        $match: { 
          month: parseInt(month),
          year: parseInt(year)
        } 
      },
      {
        $lookup: {
          from: "users",
          localField: "sales_id",
          foreignField: "_id",
          as: "sales_user"
        }
      },
      { $unwind: "$sales_user" },
      { $match: { "sales_user.leader_id": new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSalesPoints: { $sum: "$point" }
        }
      }
    ]);

    const salesPoint = salesResult.length > 0 ? salesResult[0].totalSalesPoints : 0;

    
    const sales = await User.aggregate([
      { $match: { leader_id: new mongoose.Types.ObjectId(userId) } },

      // populate target_id
      {
        $lookup: {
          from: "targets",
          localField: "target_id",
          foreignField: "_id",
          as: "target"
        }
      },
      { $unwind: { path: "$target", preserveNullAndEmptyArrays: true } },

      // populate sales points
      {
        $lookup: {
          from: "salespoints",
          let: { userId: "$_id" },
          pipeline: [
            { 
              $match: { 
                $expr: { $eq: ["$sales_id", "$$userId"] },
                month: parseInt(month),
                year: parseInt(year)
              }
            }
          ],
          as: "salesPoints"
        }
      },

      // add computed fields
      {
        $addFields: {
          totalTargetPoints: { $sum: ["$target.point", 0] },
          totalSalesPoints: { $sum: "$salesPoints.point" }
        }
      },

      // select fields
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          totalTargetPoints: 1,
          totalSalesPoints: 1
        }
      }
    ]);
    return res.status(200).json({ total_target, salesPoint, sales });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});