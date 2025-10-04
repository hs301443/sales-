import User from '../../models/modelschema/User.js'; 
import Lead from '../../models/modelschema/lead.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import mongoose from 'mongoose';

export const viewLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    
    const leads = await Lead.find({ isDeleted: false })
      .populate({
        path: 'sales_id',
        select: 'name',
        match: { isDeleted: false },
        populate: {
          path: 'leader_id',
          select: 'name', 
          match: { 
            _id: new mongoose.Types.ObjectId(userId),
            isDeleted: false 
          }
        }
      })
      .select('name status') 
      .exec();

    // Filter leads where both sales_id and leader_id exist after population
    const filteredLeads = leads.reduce((acc, lead) => {
      if (lead.sales_id && lead.sales_id.leader_id) {
        acc.push(lead);
      }
      return acc;
    }, []);

    // sales options 
    const salesOptions = await User.find({
      leader_id: userId,
      role: 'Salesman',
      isDeleted: false
    })
    .select('_id name')
    .lean();

    return res.status(200).json({ leads: filteredLeads, salesOptions });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
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
      isDeleted: false,
    })
    .select('_id name phone status created_at')
     .populate({ path: 'country', select: 'name', match: { isDeleted: false } })
     .populate({ path: 'city', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } })
    .populate({ path: 'activity_id', select: 'name ', match: { isDeleted: false } })
    .populate({ path: 'source_id', select: 'name ', match: { isDeleted: false } })

    return res.status(200).json({ leads });
  } catch (error) {   
    return ErrorResponse(res, error.message, 400);
  }
});

// leader have leades and determine sales for this leades
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
