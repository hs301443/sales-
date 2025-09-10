import Lead from '../../models/modelschema/lead.js'; 
import User from '../../models/modelschema/User.js';
import ScheduledContacts from '../../models/modelschema/scheduledcontacts.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';


export const createScheduledContact = asyncHandler(async (req, res) => {
  const { lead_id, sales_id, contact_date, notes } = req.body;

  // Check if lead exists
  const lead = await Lead.findById(lead_id);
  if (!lead) {
    return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
  }

  // Check if salesman exists and has correct role
  const salesman = await User.findById(sales_id);
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
    .populate('lead_id', 'name phone')
    .populate('sales_id', 'name');

  return SuccessResponse(res, { 
    message: 'Scheduled contact created successfully', 
    data: populatedContact 
  }, 201);
});


export const getMyScheduledContacts = asyncHandler(async (req, res) => {
  const { sales_id } = req.params; 
  
  // Check if salesman exists
  const salesman = await User.findById(sales_id);
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

 
  const scheduledContacts = await ScheduledContacts.find({ sales_id })
    .populate('lead_id', 'name phone address')
    .sort({ contact_date: 1 }); 

  return SuccessResponse(res, { 
    message: 'Scheduled contacts retrieved successfully', 
    data: scheduledContacts 
  }, 200);
});