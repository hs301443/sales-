import Commission from '../../models/modelschema/commision.js';
import SalesPoint from '../../models/modelschema/salesPoint.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewHome = asyncHandler(async (req, res) => {
        const sales_id = req.currentUser.id;
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        
        // Await the SalesPoint query
        const my_points = await SalesPoint.findOne({
            month, year, sales_id
        });

        let commissions = await Commission.find();
        
        // Calculate total points from my_points (assuming my_points has a points field)
        const totalPoints = my_points ? my_points.points || 0 : 0;
        
        commissions = commissions.map(item => {
            return {
                ...item.toObject(),
                my_level: item.point_threshold <= totalPoints
            };
        });
        
        return SuccessResponse(res, { 
            message: 'Commissions retrieved successfully', 
            data: {
                commissions,
                my_points: totalPoints
            }
        }, 200);
});