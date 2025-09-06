import User from '../../models/modelschema/User.js'; 
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

export const transferLead = asyncHandler(async (req, res) => {
  try {
      const myId = req.currentUser.id;
      const { userId } = req.params.id;

      const sales = await User.find({ leader_id: myId }).select("_id");

      const salesIds = sales.map(s => s._id);

      await Lead.updateMany(
        { sales_id: { $in: salesIds } },
        { $set: { sales_id: userId } }
      );

      res.json({ message: "Lead transfer success successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
});