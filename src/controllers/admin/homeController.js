import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import prisma from '../../lib/prisma.js';

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
            totalActivities,
            totalPopupOffers,
            totalCommissions,
            recentLeads,
            recentSales,
            recentPayments
        ] = await Promise.all([
            prisma.user.count({ where: { ...filters } }),
            prisma.user.count({ where: { ...filters, role: 'Salesman' } }),
            prisma.user.count({ where: { ...filters, role: 'Sales_Leader' } }),
            prisma.lead.count({ where: { ...filters } }),
            prisma.sales.count({ where: { ...filters } }),
            prisma.payment.count({ where: { ...filters } }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { ...filters, ...(dateFilter.$gte ? { payment_date: { gte: dateFilter.$gte, lte: dateFilter.$lte } } : {}) }
            }),
            prisma.product.count({ where: { ...filters } }),
            prisma.offer.count({ where: { ...filters } }),
            prisma.activity.count({ where: { ...filters } }),
            prisma.popupOffer ? prisma.popupOffer.count({ where: { ...filters } }) : Promise.resolve(0),
            prisma.commission.count({ where: { ...filters } }),
            prisma.lead.findMany({ where: { ...filters, ...(dateFilter.$gte ? { created_at: { gte: dateFilter.$gte, lte: dateFilter.$lte } } : {}) }, orderBy: { created_at: 'desc' }, take: 5, select: { id: true, name: true, phone: true, status: true, created_at: true } }),
            prisma.sales.findMany({ where: { ...filters, ...(dateFilter.$gte ? { sale_date: { gte: dateFilter.$gte, lte: dateFilter.$lte } } : {}) }, orderBy: { sale_date: 'desc' }, take: 5, select: { id: true, status: true, sale_date: true, item_type: true } }),
            prisma.payment.findMany({ where: { ...filters, ...(dateFilter.$gte ? { payment_date: { gte: dateFilter.$gte, lte: dateFilter.$lte } } : {}) }, orderBy: { payment_date: 'desc' }, take: 5, select: { id: true, amount: true, payment_date: true } }),
        ]);

        const totalRevenue = revenueSum?._sum?.amount || 0;

       
        const [leadStatusBreakdownData, salesStatusBreakdownData] = await Promise.all([
            prisma.lead.groupBy({ by: ['status'], _count: { status: true }, where: { ...filters, ...(dateFilter.$gte ? { created_at: { gte: dateFilter.$gte, lte: dateFilter.$lte } } : {}) } }),
            prisma.sales.groupBy({ by: ['status'], _count: { status: true }, where: { ...filters, ...(dateFilter.$gte ? { sale_date: { gte: dateFilter.$gte, lte: dateFilter.$lte } } : {}) } }),
        ]);
        const leadStatusBreakdown = leadStatusBreakdownData.map(r => ({ _id: r.status, count: r._count.status }));
        const salesStatusBreakdown = salesStatusBreakdownData.map(r => ({ _id: r.status, count: r._count.status }));

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


