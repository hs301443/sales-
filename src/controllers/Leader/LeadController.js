import prisma from '../../lib/prisma.js'; 
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const leads = await prisma.lead.findMany({
      where: { isDeleted: false, sales: { leader_id: Number(userId), isDeleted: false } },
      select: { id: true, name: true, status: true, sales: { select: { id: true, name: true, leader: { select: { id: true, name: true } } } } }
    });

    // sales options 
    const salesOptions = await prisma.user.findMany({ where: { leader_id: Number(userId), role: 'Salesman', isDeleted: false }, select: { id: true, name: true } });

    return res.status(200).json({ leads, salesOptions });
  } catch (error) {
    return ErrorResponse(res, 400, error.message);
  }
});

export const transferLead = asyncHandler(async (req, res) => {

      const myId = req.currentUser.id;
      const { salesId } = req.body;
      const { id } = req.params;

      const salesTeam = await prisma.user.findMany({ where: { leader_id: Number(myId), role: 'Salesman' }, select: { id: true, name: true } });

      if (!salesTeam || salesTeam.length === 0) {
          return res.status(400).json({ error: "You don't have any sales team members" });
      }

      const salesIds = salesTeam.map(s => s.id);

      const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });
      if (!lead || !salesIds.includes(lead.sales_id || 0)) {
        return res.status(400).json({ error: "Failed to transfer lead" });
      }
      await prisma.lead.update({ where: { id: Number(id) }, data: { sales_id: Number(salesId), transfer: true } });

      return res.status(200).json({ message: "Lead transferred successfully" });
});

export const viewCompanyLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const leads = await prisma.lead.findMany({
      where: { type: 'company', isDeleted: false, sales: { leader_id: Number(userId), isDeleted: false } },
      select: {
        id: true, name: true, phone: true, status: true, created_at: true,
        country: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        sales: { select: { id: true, name: true } },
        activity: { select: { id: true, name: true } },
        source: { select: { id: true, name: true } },
      }
    });

    return res.status(200).json({ leads });
  } catch (error) {   
    return ErrorResponse(res, 400 ,error.message);
  }
});

// leader have leades and determine sales for this leades

export const determineSales = asyncHandler(async (req, res) => {
  try {
    const myId = req.currentUser.id;
    const { salesId } = req.body;
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({ where: { id: Number(id) } });

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    if (lead.sales_id === Number(myId)) {
      return res.status(400).json({ error: "You are already the sales person for this lead" });
    }

    const result = await prisma.lead.update({ where: { id: Number(id) }, data: { sales_id: Number(salesId) } });

    if (!result) {
      return res.status(400).json({ error: "Failed to determine sales" });
    }

    return res.json({ message: "Sales determined successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});