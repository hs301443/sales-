import Lead from '../../models/modelschema/lead.js';
import User from '../../models/modelschema/User.js';
import Activity from '../../models/modelschema/Activity.js';
import Source from '../../models/modelschema/Source.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createLead = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    address,
    type,
    status,
    sales_id,
    activity_id,
    source_id,
  } = req.body;

  // check sales_id is exist 
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // check activity_id is exist
    const activity = await Activity.findById(activity_id);
    if (!activity) {
        return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }

    if (type === 'company' && !source_id) {
    return ErrorResponse(res, 400, { message: 'Source ID is required for company type' });
  }

  // If type is 'sales', source_id should not be provided
  if (type === 'sales' && source_id) {
    return ErrorResponse(res, 400, { message: 'Source ID should not be provided for sales type' });
  }

  // check source_id is exist
  if(source_id){
    const source = await Source.findById(source_id);
    if (!source) {
        return ErrorResponse(res, 400, { message: 'Invalid source_id' });
    }
  }

  const lead = await Lead.create({
    name,
    phone,
    address,
    type,
    status,
    sales_id,
    activity_id,
    source_id: type === 'company' ? source_id : null,
  });

  return SuccessResponse(res, { message: 'Lead created successfully' }, 201);
});

export const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find()
    .populate('activity_id', 'name status')
    .populate('source_id', 'name status')
    .populate('sales_id', 'name')
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Leads retrieved successfully', data: leads }, 200);
});

export const getLeadById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lead = await Lead.findById(id)
    .populate('activity_id', 'name status')
    .populate('source_id', 'name status')
    .populate('sales_id', 'name');

  if (!lead) {
    throw new NotFound('Lead not found');
  }

  return SuccessResponse(res, { message: 'Lead retrieved successfully', data: lead }, 200);
});


export const updateLead = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lead = await Lead.findById(id);

  if (!lead) {
    throw new NotFound('Lead not found');
  }

  const {
    name,
    phone,
    address,
    type,
    status,
    sales_id,
    activity_id,
    source_id,
  } = req.body;

  lead.name = name || lead.name;
  lead.phone = phone || lead.phone;
  lead.address = address || lead.address;
  lead.type = type || lead.type;
  lead.status = status || lead.status;
  lead.sales_id = sales_id || lead.sales_id;
  lead.activity_id = activity_id || lead.activity_id;
  lead.source_id = source_id || lead.source_id;

  await lead.save();

  return SuccessResponse(res, { message: 'Lead updated successfully' }, 200);
});

export const deleteLead = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new NotFound('Lead not found');
  }

  return SuccessResponse(res, { message: 'Lead deleted successfully' }, 200);
});