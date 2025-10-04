import Lead from '../../models/modelschema/lead.js'; 
import User from '../../models/modelschema/User.js';
import ScheduledContacts from '../../models/modelschema/scheduledcontacts.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';


export const createScheduledContact = asyncHandler(async (req, res) => {
  const { lead_id, sales_id, contact_date, contact_time ,notes } = req.body;

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
    contact_time,
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

export const updateScheduledContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lead_id, sales_id, contact_date, contact_time, notes, status } = req.body;
  const currentUser = req.currentUser;

  // Check if scheduled contact exists and belongs to current user
  const existingContact = await ScheduledContacts.findOne({ 
    _id: id, 
    isDeleted: false 
  });

  if (!existingContact) {
    return ErrorResponse(res, 404, { message: 'Scheduled contact not found' });
  }

  // If user is Salesman, ensure they can only update their own contacts
  if (currentUser.role === 'Salesman') {
    if (existingContact.sales_id.toString() !== currentUser.id) {
      return ErrorResponse(res, 403, { message: 'Access denied. You can only update your own scheduled contacts' });
    }
  }

  // Validate lead_id if provided
  if (lead_id) {
    const lead = await Lead.findOne({ _id: lead_id, isDeleted: false });
    if (!lead) {
      return ErrorResponse(res, 400, { message: 'Invalid lead_id' });
    }
  }

  // Validate sales_id if provided
  if (sales_id) {
    const salesman = await User.findOne({ _id: sales_id, isDeleted: false });
    if (!salesman || salesman.role !== 'Salesman') {
      return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
    }

    // If user is Salesman, prevent them from changing sales_id to someone else
    if (currentUser.role === 'Salesman' && sales_id !== currentUser.id) {
      return ErrorResponse(res, 403, { message: 'Salesman cannot assign contacts to other salespeople' });
    }
  }

  // Prepare update data
  const updateData = {};
  if (lead_id) updateData.lead_id = lead_id;
  if (sales_id) updateData.sales_id = sales_id;
  if (contact_date) updateData.contact_date = contact_date;
  if (contact_time) updateData.contact_time = contact_time;
  if (notes) updateData.notes = notes;
  if (status !== undefined) updateData.status = status;

  // Update the scheduled contact
  const updatedContact = await ScheduledContacts.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  // Populate the updated contact
  const populatedContact = await ScheduledContacts.findById(updatedContact._id)
    .populate({ path: 'lead_id', select: 'name phone', match: { isDeleted: false } })
    .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } });

  return SuccessResponse(res, { 
    message: 'Scheduled contact updated successfully', 
    data: populatedContact 
  }, 200);
});

// get by id
export const getScheduledContactById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.currentUser;
  // Check if scheduled contact exists
  const scheduledContact = await ScheduledContacts.findOne({
    _id: id,
    isDeleted: false
  })
  .populate({ path: 'lead_id', select: 'name phone', match: { isDeleted: false } })
  .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } });
  if (!scheduledContact) {
    return ErrorResponse(res, 404, { message: 'Scheduled contact not found' });
  }
  // If user is Salesman, ensure they can only access their own contacts
  if (currentUser.role === 'Salesman') {
    if (scheduledContact.sales_id._id.toString() !== currentUser.id) {
      return ErrorResponse(res, 403, { message: 'Access denied. You can only access your own scheduled contacts' });
    }
  }

  return SuccessResponse(res, { 
    message: 'Scheduled contact retrieved successfully', 
    data: scheduledContact 
  }, 200);
});
