import User from '../../models/modelschema/User.js';
import SalesPoint from '../../models/modelschema/salesPoint.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import mongoose from 'mongoose';

export const viewHome = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { month, year } = req.query;

    // Get all sales users under the leader
    const salesUsers = await User.find({
      leader_id: new mongoose.Types.ObjectId(userId),
      isDeleted: false
    })
    .populate({
      path: 'target_id',
      match: { isDeleted: false },
      select: 'point'
    })
    .select('name email phone target_id')
    .lean();

    // Calculate total target points using reduce
    const total_target = salesUsers.reduce((sum, user) => {
      return sum + (user.target_id?.point || 0);
    }, 0);

    // Get sales points for the specified month/year
    const salesPoints = await SalesPoint.find({
      month: parseInt(month),
      year: parseInt(year),
      isDeleted: false,
      sales_id: { $in: salesUsers.map(user => user._id) }
    })
    .populate({
      path: 'sales_id',
      match: { 
        leader_id: new mongoose.Types.ObjectId(userId),
        isDeleted: false 
      },
      select: 'name'
    })
    .select('point sales_id')
    .lean();

    // Filter out sales points where sales_id didn't populate (not under this leader)
    const validSalesPoints = salesPoints.filter(sp => sp.sales_id);

    // Calculate total sales points using reduce
    const salesPoint = validSalesPoints.reduce((sum, sp) => sum + (sp.point || 0), 0);

    // Process sales data with reduce
    const sales = salesUsers.reduce((acc, user) => {
      const userSalesPoints = validSalesPoints.filter(sp => 
        sp.sales_id._id.toString() === user._id.toString()
      );
      
      const totalSalesPoints = userSalesPoints.reduce((sum, sp) => sum + (sp.point || 0), 0);
      
      acc.push({
        name: user.name,
        email: user.email,
        phone: user.phone,
        totalTargetPoints: user.target_id?.point || 0,
        totalSalesPoints: totalSalesPoints
      });
      
      return acc;
    }, []);

    return res.status(200).json({ total_target, salesPoint, sales });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});

export const getAllMySales = asyncHandler(async (req, res) => {
   
   const userId = req.currentUser.id;

   // sales options 
    const salesOptions = await User.find({
      leader_id: userId,
      role: 'Salesman',
      isDeleted: false
    })
    .select('_id name')
    .lean();

     return res.status(200).json({ salesOptions });
})