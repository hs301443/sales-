import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewHome = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { month, year } = req.query;
 
  
    const salesUsers = await prisma.user.findMany({
      where: { leader_id: Number(userId), role: 'Salesman', isDeleted: false },
      select: { id: true, name: true, email: true, target: { select: { point: true } } }
    });

    // Calculate total target points using reduce
    const total_target = salesUsers.reduce((sum, user) => sum + (user.target?.point || 0), 0);

    // Get sales points for the specified month/year
    const salesPoints = await prisma.salesPoint.findMany({
      where: { month: Number(month), year: Number(year), isDeleted: false, salesUser: { leader_id: Number(userId), isDeleted: false } },
      select: { point: true, salesUser: { select: { id: true, name: true } } }
    });

       // check month and year in db if not exist give him empty 
     

    // Filter out sales points where sales_id didn't populate (not under this leader)
    const validSalesPoints = salesPoints.filter(sp => sp.salesUser);

    // Calculate total sales points using reduce
    const salesPoint = validSalesPoints.reduce((sum, sp) => sum + (sp.point || 0), 0);

    // Process sales data with reduce
    const sales = salesUsers.map(user => {
      const userSalesPoints = validSalesPoints.filter(sp => sp.salesUser.id === user.id);
      const totalSalesPoints = userSalesPoints.reduce((sum, sp) => sum + (sp.point || 0), 0);
      return {
        name: user.name,
        email: user.email,
        totalTargetPoints: user.target?.point || 0,
        totalSalesPoints,
      };
    });

    return res.status(200).json({ total_target, salesPoint, sales });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});

export const getAllMySales = asyncHandler(async (req, res) => {
   
   const userId = req.currentUser.id;

   // sales options 
    const salesOptions = await prisma.user.findMany({ where: { leader_id: Number(userId), role: 'Salesman', isDeleted: false }, select: { id: true, name: true } });

     return res.status(200).json({ salesOptions });
})