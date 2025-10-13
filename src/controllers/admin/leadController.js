import prisma from '../../lib/prisma.js';
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
  const sales = await prisma.user.findUnique({ where: { id: Number(sales_id) } });
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // Check if activity_id exists
  const activity = await prisma.activity.findUnique({ where: { id: Number(activity_id) } });
  if (!activity) {
    return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
  }

  // Check if country exists (now required)
  const countryExists = await prisma.country.findUnique({ where: { id: Number(country) } });
  if (!countryExists) {
    return ErrorResponse(res, 400, { message: 'Invalid country' });
  }

  // Check if city exists and belongs to the country
  if (city) {
    const cityExists = await prisma.city.findFirst({ where: { id: Number(city), country_id: Number(country), isDeleted: false } });
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
    const source = await prisma.source.findUnique({ where: { id: Number(source_id) } });
    if (!source) {
      return ErrorResponse(res, 400, { message: 'Invalid source_id' });
    }
  }

  // Check if phone already exists
  const existingLead = await prisma.lead.findFirst({ where: { phone, isDeleted: false } });
  
  if (existingLead) {
    return ErrorResponse(res, 400, { message: 'Lead with this phone number already exists' });
  }

  // Create the lead
  const leadCreated = await prisma.lead.create({
    data: {
      name,
      phone,
      country_id: Number(country),
      city_id: city ? Number(city) : null,
      type,
      status,
      sales_id: Number(sales_id),
      activity_id: Number(activity_id),
      source_id: source_id ? Number(source_id) : null,
    }
  });

  // Populate the lead with related data for response
  const populatedLead = await prisma.lead.findUnique({
    where: { id: leadCreated.id },
    select: {
      id: true,
      name: true,
      phone: true,
      type: true,
      status: true,
      country: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
      sales: { select: { id: true, name: true, email: true } },
      activity: { select: { id: true, name: true } },
      source: { select: { id: true, name: true } },
    }
  });

  return SuccessResponse(res, { 
    message: 'Lead created successfully',
    data: populatedLead 
  }, 201);
});

export const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await prisma.lead.findMany({
    where: { isDeleted: false },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      phone: true,
      type: true,
      status: true,
      created_at: true,
      activity: { select: { id: true, name: true, status: true } },
      source: { select: { id: true, name: true, status: true } },
      sales: { select: { id: true, name: true } },
      country: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
    }
  });

  const [activeSales, activityOptions, sourceOptions, CountryOptions, CityOptions] = await Promise.all([
    prisma.user.findMany({ where: { role: 'Salesman', status: 'Active', isDeleted: false }, select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } }),
    prisma.activity.findMany({ where: { status: 'Active', isDeleted: false }, select: { id: true, name: true, status: true }, orderBy: { name: 'asc' } }),
    prisma.source.findMany({ where: { status: 'Active', isDeleted: false }, select: { id: true, name: true, status: true }, orderBy: { name: 'asc' } }),
    prisma.country.findMany({ where: { isDeleted: false }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.city.findMany({ where: { isDeleted: false }, select: { id: true, name: true, country_id: true }, orderBy: { name: 'asc' } }),
  ]);

  return SuccessResponse(res, {
    message: 'Leads retrieved successfully',
    data: { leads, SalesOptions: activeSales, ActivityOptions: activityOptions, SourceOptions: sourceOptions, CountryOptions, CityOptions }
  }, 200);
});


export const getLeadById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const lead = await prisma.lead.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      phone: true,
      type: true,
      status: true,
      activity: { select: { id: true, name: true, status: true } },
      source: { select: { id: true, name: true, status: true } },
      sales: { select: { id: true, name: true } },
    }
  });

  if (!lead) {
    throw new NotFound('Lead not found');
  }

  return SuccessResponse(res, { message: 'Lead retrieved successfully', data: lead }, 200);
});


export const updateLead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const lead = await prisma.lead.findUnique({ where: { id } });

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
  const sales = await prisma.user.findUnique({ where: { id: Number(sales_id) } });
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }
}

    if(activity_id){
    const activity = await prisma.activity.findUnique({ where: { id: Number(activity_id) } });
    if (!activity) {
        return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }
  }

  if(source_id){
    const source = await prisma.source.findUnique({ where: { id: Number(source_id) } });
    if (!source) {
        return ErrorResponse(res, 400, { message: 'Invalid source_id' });
    }
  }

  await prisma.lead.update({
    where: { id },
    data: {
      name: name ?? undefined,
      phone: phone ?? undefined,
      type: type ?? undefined,
      status: status ?? undefined,
      sales_id: sales_id !== undefined ? Number(sales_id) : undefined,
      activity_id: activity_id !== undefined ? Number(activity_id) : undefined,
      source_id: source_id !== undefined ? Number(source_id) : undefined,
    }
  });

  return SuccessResponse(res, { message: 'Lead updated successfully' }, 200);
});

export const deleteLead = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const lead = await prisma.lead.findUnique({ where: { id } });

  if (!lead || lead.isDeleted) {
    throw new NotFound('Lead not found');
  }

  await prisma.lead.update({ where: { id }, data: { isDeleted: true } });

  return SuccessResponse(res, { message: 'Lead deleted successfully' }, 200);
});