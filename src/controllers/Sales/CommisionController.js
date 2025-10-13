import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewHome = asyncHandler(async (req, res) => {
        const sales_id = req.currentUser.id;
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        
        const my_points = await prisma.salesPoint.findFirst({ where: { month, year, sales_id: Number(sales_id), isDeleted: false } });

        let commissions = await prisma.commission.findMany({ where: { isDeleted: false } });
        
        const totalPoints = my_points ? my_points.point || 0 : 0;
        
        commissions = commissions.map(item => ({ ...item, my_level: item.level_name }));
        
        return SuccessResponse(res, { 
            message: 'Commissions retrieved successfully', 
            data: {
                commissions,
                my_points: totalPoints
            }
        }, 200);
});