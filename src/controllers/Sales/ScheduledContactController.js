import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';


export const createScheduledContact = asyncHandler(async (req, res) => {
  const { lead_id, contact_date, contact_time ,notes } = req.body;
  const sales_id  = Number(req.currentUser.id); 

  // Check if lead exists
  const lead = await prisma.lead.findFirst({ where: { id: Number(lead_id), isDeleted: false } });
  if (!lead) {
    return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
  }

  // Check if salesman exists and has correct role
  const salesman = await prisma.user.findUnique({ where: { id: sales_id } });
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  const scheduledContact = await prisma.scheduledContact.create({
    data: {
      lead_id: Number(lead_id),
      sales_id,
      contact_date: new Date(contact_date),
      contact_time,
      notes: notes || null,
      status: false,
    },
    select: {
      id: true,
      contact_date: true,
      contact_time: true,
      notes: true,
      status: true,
      lead: { select: { id: true, name: true, phone: true } },
    }
  });

  return SuccessResponse(res, { 
    message: 'Scheduled contact created successfully', 
    data: scheduledContact 
  }, 201);
});


export const getMyScheduledContacts = asyncHandler(async (req, res) => {
  const sales_id  = Number(req.currentUser.id); 
  
  // Check if salesman exists
  const salesman = await prisma.user.findUnique({ where: { id: sales_id } });
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

 
  const scheduledContacts = await prisma.scheduledContact.findMany({
    where: { sales_id },
    orderBy: { contact_date: 'asc' },
    select: {
      id: true,
      contact_date: true,
      contact_time: true,
      notes: true,
      status: true,
      lead: { select: { id: true, name: true, phone: true } },
      salesUser: { select: { id: true, name: true } },
    }
  }); 

    // lead Options
  const leadOptions = await prisma.lead.findMany({ where: { sales_id, isDeleted: false }, select: { id: true, name: true, phone: true } });

  return SuccessResponse(res, { 
    message: 'Scheduled contacts retrieved successfully', 
    data: scheduledContacts,
    leadOptions
  }, 200);
});

export const updateScheduledContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lead_id, contact_date, contact_time, notes, status } = req.body;
  const sales_id  = Number(req.currentUser.id); 


  // Check if scheduled contact exists and belongs to current user
  const existingContact = await prisma.scheduledContact.findFirst({ where: { id: Number(id), isDeleted: false } });

  if (!existingContact) {
    return ErrorResponse(res, 404, { message: 'Scheduled contact not found' });
  }

  // If user is Salesman, ensure they can only update their own contacts
  const currentUser = await prisma.user.findUnique({ where: { id: sales_id } });
  if (currentUser.role === 'Salesman') {
    if (existingContact.sales_id !== sales_id) {
      return ErrorResponse(res, 403, { message: 'Access denied. You can only update your own scheduled contacts' });
    }
  }

  // Validate lead_id if provided
  if (lead_id) {
    const lead = await prisma.lead.findFirst({ where: { id: Number(lead_id), isDeleted: false } });
    if (!lead) {
      return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
    }
  }

  // Validate sales_id if provided
  if (sales_id) {
    const salesman = await prisma.user.findUnique({ where: { id: sales_id } });
    if (!salesman || salesman.role !== 'Salesman') {
      return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
    }

    // If user is Salesman, prevent them from changing sales_id to someone else
    if (salesman.role === 'Salesman' && sales_id !== salesman.id) {
      return ErrorResponse(res, 403, { message: 'Salesman cannot assign contacts to other salespeople' });
    }
  }

  // Prepare update data
  const updatedContact = await prisma.scheduledContact.update({
    where: { id: Number(id) },
    data: {
      lead_id: lead_id ? Number(lead_id) : undefined,
      sales_id: sales_id || undefined,
      contact_date: contact_date ? new Date(contact_date) : undefined,
      contact_time: contact_time ?? undefined,
      notes: notes ?? undefined,
      status: status !== undefined ? Boolean(status) : undefined,
    },
    select: {
      id: true,
      contact_date: true,
      contact_time: true,
      notes: true,
      status: true,
      lead: { select: { id: true, name: true, phone: true } },
      salesUser: { select: { id: true, name: true } },
    }
  });

  return SuccessResponse(res, { message: 'Scheduled contact updated successfully', data: updatedContact }, 200);
});

// get by id
export const getScheduledContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.currentUser;


  const scheduledContact = await prisma.scheduledContact.findFirst({
    where: { id: Number(id), isDeleted: false },
    select: {
      id: true,
      contact_date: true,
      contact_time: true,
      notes: true,
      status: true,
      lead: { select: { id: true, name: true, phone: true } },
      salesUser: { select: { id: true, name: true } },
    }
  });
  
  if (!scheduledContact) {
    return ErrorResponse(res, 404, { message: 'Scheduled contact not found' });
  }
  
  // If user is Salesman, ensure they can only access their own contacts
  if (currentUser.role === 'Salesman') {
    const meId = Number(currentUser.id);
    const owner = await prisma.scheduledContact.findUnique({ where: { id: Number(id) }, select: { sales_id: true } });
    if (owner && owner.sales_id !== meId) {
      return ErrorResponse(res, 403, { message: 'Access denied. You can only access your own scheduled contacts' });
    }
  }

  return SuccessResponse(res, { message: 'Scheduled contact retrieved successfully', data: scheduledContact }, 200);
});
