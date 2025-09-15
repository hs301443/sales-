import User from '../../models/modelschema/User.js'; 
import Lead from '../../models/modelschema/lead.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import mongoose from 'mongoose';

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
        "leader._id": new mongoose.Types.ObjectId(userId)
      }
    }
  ]);

    return res.status(200).json({ leads });
  } catch (error) {
    return ErrorResponse(res, 400, error.message, );
  }
});

export const transferLead = asyncHandler(async (req, res) => {

      const myId = req.currentUser.id;
      const { salesId } = req.body;
      const { id } = req.params;

      // Check if the current user is a leader and get their sales team
      const salesTeam = await User.find({ 
          leader_id: myId, 
          role: 'Salesman' 
      }).select("_id name");

      if (!salesTeam || salesTeam.length === 0) {
          return res.status(400).json({ error: "You don't have any sales team members" });
      }

      const salesIds = salesTeam.map(s => s._id.toString());

      // Update the lead
      const result = await Lead.updateOne(
          { 
              _id: id,
              sales_id: { $in: salesIds } 
          },
          { 
              $set: { 
                  sales_id: salesId,
                  transfer: true
              } 
          }
      );

      if (result.modifiedCount === 0) {
          return res.status(400).json({ error: "Failed to transfer lead" });
      }

      return res.status(200).json({ message: "Lead transferred successfully" });
});

export const viewCompanyLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const leads = await Lead.find({
      type: 'company',
      sales_id: { $exists: false },
    })
    .select('_id name phone address created_at')
    .populate('activity_id')
    .populate('source_id')

    return res.status(200).json({ leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const determineSales = asyncHandler(async (req, res) => {
  try {
      const myId = req.currentUser.id;
      const { salesId } = req.body.salesId;  
      const { id } = req.params.id;  

      await Lead.updateMany(
        { sales_id: { $exists: false },
          '_id' : id },
        { $set: { sales_id: salesId } }
      );

      res.json({ message: "You determine sales successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
});