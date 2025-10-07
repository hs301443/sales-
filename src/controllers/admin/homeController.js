import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import mongoose from 'mongoose';
import User from '../../models/modelschema/User.js';
import Lead from '../../models/modelschema/lead.js';
import Sales from '../../models/modelschema/sales.js';
import Payment from '../../models/modelschema/payment.js';
import Product from '../../models/modelschema/product.js';
import Offer from '../../models/modelschema/Offer.js';
import PaymentMethod from '../../models/modelschema/paymentMethod.js';
import Activity from '../../models/modelschema/activity.js';
import PopupOffer from '../../models/modelschema/popupOffer.js';
import Commission from '../../models/modelschema/commision.js';

export const viewAdminHome = asyncHandler(async (req, res) => {
    try {
        const { month, year } = req.query;

        const filters = { isDeleted: false };
        const dateFilter = {};
        if (month && year) {
            const start = new Date(parseInt(year), parseInt(month) - 1, 1);
            const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
            dateFilter.$gte = start;
            dateFilter.$lte = end;
        }

        const [
            totalUsers,
            totalSalesmen,
            totalLeaders,
            totalLeads,
            totalSales,
            totalPayments,
            revenueSum,
            totalProducts,
            totalOffers,
            totalPaymentMethods,
            totalActivities,
            totalPopupOffers,
            totalCommissions,
            recentLeads,
            recentSales,
            recentPayments
        ] = await Promise.all([
            User.countDocuments({ ...filters }),
            User.countDocuments({ ...filters, role: 'Salesman' }),
            User.countDocuments({ ...filters, role: 'Sales Leader' }),
            Lead.countDocuments({ ...filters }),
            Sales.countDocuments({ ...filters }),
            Payment.countDocuments({ ...filters }),
            Payment.aggregate([
                { $match: { ...filters, ...(dateFilter.$gte ? { payment_date: dateFilter } : {}) } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Product.countDocuments({ ...filters }),
            Offer.countDocuments({ ...filters }),
            PaymentMethod.countDocuments({ ...filters }),
            Activity.countDocuments({ ...filters }),
            PopupOffer.countDocuments({ ...filters }),
            Commission.countDocuments({ ...filters }),
            Lead.find({ ...filters, ...(dateFilter.$gte ? { created_at: dateFilter } : {}) })
                .sort({ created_at: -1 })
                .limit(5)
                .select('name phone status created_at')
                .lean(),
            Sales.find({ ...filters, ...(dateFilter.$gte ? { sale_date: dateFilter } : {}) })
                .sort({ sale_date: -1 })
                .limit(5)
                .select('status sale_date item_type')
                .lean(),
            Payment.find({ ...filters, ...(dateFilter.$gte ? { payment_date: dateFilter } : {}) })
                .sort({ payment_date: -1 })
                .limit(5)
                .select('amount payment_date')
                .lean(),
        ]);

        const totalRevenue = Array.isArray(revenueSum) && revenueSum[0] ? revenueSum[0].total : 0;

       
        const [leadStatusBreakdown, salesStatusBreakdown] = await Promise.all([
            Lead.aggregate([
                { $match: { ...filters, ...(dateFilter.$gte ? { created_at: dateFilter } : {}) } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Sales.aggregate([
                { $match: { ...filters, ...(dateFilter.$gte ? { sale_date: dateFilter } : {}) } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ])
        ]);

        const response = {
            totals: {
                users: totalUsers,
                salesmen: totalSalesmen,
                leaders: totalLeaders,
                leads: totalLeads,
                sales: totalSales,
                payments: totalPayments,
                revenue: totalRevenue,
                products: totalProducts,
                offers: totalOffers,
                paymentMethods: totalPaymentMethods,
                activities: totalActivities,
                popupOffers: totalPopupOffers,
                commissions: totalCommissions,
                leadsByStatus: leadStatusBreakdown,
                salesByStatus: salesStatusBreakdown,
            recent: {
                leads: recentLeads,
                sales: recentSales,
                payments: recentPayments
            },
        }
        };

        return SuccessResponse(res, {message: 'Admin statistics'}, 200, response);
    } catch (error) {
        return ErrorResponse(res, 400, error.message);
    }
});

export default {
    viewAdminHome
};


