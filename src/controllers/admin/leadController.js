import Lead from '../../models/modelschema/lead.js';
import User from '../../models/modelschema/User.js';
import Activity from '../../models/modelschema/activity.js';
import Source from '../../models/modelschema/Source.js';
import Country from '../../models/modelschema/country.js';
import City from '../../models/modelschema/city.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createLead = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    country,    
    city,       
    type,
    status,
    sales_id,
    activity_id,
    source_id,
  } = req.body;

  // Check if sales_id exists and is a Salesman
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // Check if activity_id exists
  const activity = await Activity.findById(activity_id);
  if (!activity) {
    return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
  }

  // Check if country exists (now required)
  const countryExists = await Country.findById(country);
  if (!countryExists) {
    return ErrorResponse(res, 400, { message: 'Invalid country' });
  }

  // Check if city exists and belongs to the country
  if (city) {
    const cityExists = await City.findOne({
      _id: city,
      country: country, 
      isDeleted: false
    });
    if (!cityExists) {
      return ErrorResponse(res, 400, { message: 'Invalid city or city does not belong to selected country' });
    }
  }

  // Validate source_id based on type
  if (type === 'company' && !source_id) {
    return ErrorResponse(res, 400, { message: 'Source ID is required for company type' });
  }

  // Check source_id exists if provided
  if (source_id) {
    const source = await Source.findById(source_id);
    if (!source) {
      return ErrorResponse(res, 400, { message: 'Invalid source_id' });
    }
  }

  // Check if phone already exists
  const existingLead = await Lead.findOne({ 
    phone, 
    isDeleted: false 
  });
  
  if (existingLead) {
    return ErrorResponse(res, 400, { message: 'Lead with this phone number already exists' });
  }

  // Create the lead
  const lead = await Lead.create({
    name,
    phone,
    country,
    city,
    type,
    status,
    sales_id,
    activity_id,
    source_id
  });

  // Populate the lead with related data for response
  const populatedLead = await Lead.findById(lead._id)
    .populate('country', 'name')
    .populate('city', 'name')
    .populate('sales_id', 'name email')
    .populate('activity_id', 'name')
    .populate('source_id', 'name');

  return SuccessResponse(res, { 
    message: 'Lead created successfully',
    data: populatedLead 
  }, 201);
});

export const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find({ isDeleted: false })
    .select('-isDeleted')
    .populate({ path: 'activity_id', select: 'name status ', match: { isDeleted: false } })
    .populate({ path: 'source_id',   select: 'name status ', match: { isDeleted: false } })
    .populate({ path: 'sales_id',    select: 'name ',        match: { isDeleted: false } })
    .populate({ path: 'country',     select: 'name',        match: { isDeleted: false } })
    .populate({ path: 'city',        select: 'name',match: { isDeleted: false } })
    .sort({ created_at: -1 });

  const activeSales = await User.find({
    role: 'Salesman',
    status: 'Active',
    isDeleted: false
  }).select('_id name email').sort({ name: 1 });

  const activityOptions = await Activity.find({ status: true, isDeleted: false })
    .select('_id name status').sort({ name: 1 });

  const sourceOptions = await Source.find({ status: 'Active', isDeleted: false })
    .select('_id name status').sort({ name: 1 });

  const CountryOptions = await Country.find({ isDeleted: false })
    .select('_id name').sort({ name: 1 });
    
  const CityOptions = await City.find({ isDeleted: false })
    .select('_id name country').sort({ name: 1 });

  return SuccessResponse(res, {
    message: 'Leads retrieved successfully',
    data: { leads, SalesOptions: activeSales, ActivityOptions: activityOptions, SourceOptions: sourceOptions, CountryOptions, CityOptions }
  }, 200);
});


export const getLeadById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lead = await Lead.findOne({ _id: id, isDeleted: false })
    .select('-isDeleted')
    .populate({ path: 'activity_id', select: 'name status ', match: { isDeleted: false } })
    .populate({ path: 'source_id',   select: 'name status ', match: { isDeleted: false } })
    .populate({ path: 'sales_id',    select: 'name ',        match: { isDeleted: false } })

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

  if(sales_id){
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }
}

    if(activity_id){
    const activity = await Activity.findById(activity_id);
    if (!activity) {
        return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }
  }

  if(source_id){
    const source = await Source.findById(source_id);
    if (!source) {
        return ErrorResponse(res, 400, { message: 'Invalid source_id' });
    }
  }


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
  const lead = await Lead.findById(id);

  if (!lead || lead.isDeleted) {
    throw new NotFound('Lead not found');
  }

  lead.isDeleted = true;
  await lead.save();

  return SuccessResponse(res, { message: 'Lead deleted successfully' }, 200);
});