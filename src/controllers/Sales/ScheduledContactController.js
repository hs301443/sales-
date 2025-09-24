import Lead from '../../models/modelschema/lead.js'; 
import User from '../../models/modelschema/User.js';
import ScheduledContacts from '../../models/modelschema/scheduledcontacts.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';


export const createScheduledContact = asyncHandler(async (req, res) => {
  const { lead_id, sales_id, contact_date, notes } = req.body;

  // Check if lead exists
  const lead = await Lead.findOne({ _id: lead_id, isDeleted: false });
  if (!lead) {
    return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
  }

  // Check if salesman exists and has correct role
  const salesman = await User.findOne({ _id: sales_id, isDeleted: false });
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }


  const scheduledContact = await ScheduledContacts.create({
    lead_id,
    sales_id,
    contact_date,
    notes,
    status: false 
  });

  const populatedContact = await ScheduledContacts.findById(scheduledContact._id)
    .populate({ path: 'lead_id', select: 'name phone', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } });

  return SuccessResponse(res, { 
    message: 'Scheduled contact created successfully', 
    data: populatedContact 
  }, 201);
});


export const getMyScheduledContacts = asyncHandler(async (req, res) => {
  const sales_id  = req.currentUser.id; 
  
  // Check if salesman exists
  const salesman = await User.findById(sales_id);
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

 
  const scheduledContacts = await ScheduledContacts.find({ sales_id })
    .populate({ path: 'lead_id', select: 'name phone address', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } })
    .sort({ contact_date: 1 }); 

    // lead Options
    const leadOptions = await Lead.find({ sales_id, isDeleted: false })
    .select('name phone address');

    // sales options
    const salesOptions = await User.find({ _id: sales_id, isDeleted: false })
    .select('name');

  return SuccessResponse(res, { 
    message: 'Scheduled contacts retrieved successfully', 
    data: scheduledContacts,
    leadOptions,
    salesOptions 
  }, 200);
});