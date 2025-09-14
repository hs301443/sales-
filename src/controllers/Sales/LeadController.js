import Lead from '../../models/modelschema/lead.js'; 
import Activity from '../../models/modelschema/Activity.js';
import User from '../../models/modelschema/User.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const company_leads = await Lead.find({sales_id: userId,
      type: 'company',
      status: {$in:['intersted', 'negotiation']},
      transfer: false,
    })
    .select('_id name phone address status type created_at')
    .sort({ created_at: -1 })
    .populate('source_id')
    .populate('activity_id');
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['intersted', 'negotiation']},
      transfer: false,
    })
    .select('_id name phone address status type created_at')
    .sort({ created_at: -1 }) 
    .populate('activity_id');

    return res.status(200).json({ company_leads, my_leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});


export const viewTransferLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const company_leads = await Lead.find({sales_id: userId,
      type: 'company',
      status: {$in:['intersted', 'negotiation']},
      transfer: true,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate('source_id')
    .populate('activity_id');
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['intersted', 'negotiation']},
      transfer: true,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate('activity_id');

    return res.status(200).json({ company_leads, my_leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const viewDemoLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const company_leads = await Lead.find({sales_id: userId,
      type: 'company',
      status: {$in:['demo_request', 'demo_done']},
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate('source_id')
    .populate('activity_id');
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['demo_request', 'demo_done']},
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate('activity_id');

    return res.status(200).json({ company_leads, my_leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});


export const viewApproveLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const company_leads = await Lead.find({sales_id: userId,
      type: 'company',
      status: 'approve', 
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate('source_id')
    .populate('activity_id');
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: 'approve', 
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate('activity_id');

    return res.status(200).json({ company_leads, my_leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const viewRejectLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const company_leads = await Lead.find({sales_id: userId,
      type: 'company',
      status: 'reject', 
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate('source_id')
    .populate('activity_id');
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: 'reject', 
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate('activity_id');

    return res.status(200).json({ company_leads, my_leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const getLeadById = asyncHandler(async (req, res) => {
  try { 
    const id = req.params.id;
    const lead = await Lead.findById(id);

    return res.status(200).json({ lead });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const createLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const {name, phone, address, activity_id} = req.body
    const activity = await Activity.findById(activity_id);
    if (!activity) {
        return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }
    const leadRequest = await Lead.create({
      name,
      phone,
      address,
      type: 'sales',
      sales_id: userId,
      status: 'intersted',
      activity_id, 
    });

    return res.status(200).json({ 'success': 'You add lead success' });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const updateLead = asyncHandler(async (req, res) => {
    const userId = req.currentUser.id;
    const {name, phone, address, status, activity_id} = req.body
    
    if(activity_id){
    const activity = await Activity.findById(activity_id);
    if (!activity) {
        return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }
  }
    const lead = await Lead.findOne({sales_id: userId});
  
    if (!lead) {
      throw new NotFound('Lead not found');
    }

    lead.name = name || lead.name;
    lead.phone = phone || lead.phone;
    lead.address = address || lead.address;
    lead.status = status || lead.status;
    lead.activity_id = activity_id || lead.activity_id;
    await lead.save();

    return res.status(200).json({ 'success': 'You update lead success' });
});

export const deleteLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id; 
    const id = req.body.id; 
    const lead = await Lead.findOneAndRemove({_id:id, sales_id: userId});
  
    if (!lead) {
      throw new NotFound('Lead not found');
    }

    lead.name = name || lead.name;
    lead.phone = phone || lead.phone;
    lead.address = address || lead.address;
    lead.status = status || lead.status;
    lead.activity_id = activity_id || lead.activity_id;
    await lead.save();

    return res.status(200).json({ 'success': 'You update lead success' });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});


export const getSalesmanInterestedLeadsCount = asyncHandler(async (req, res) => {
  const { sales_id } = req.params;
  
    // check sales_id is exist 
    const sales = await User.findById(sales_id);
    if (!sales || sales.role !== 'Salesman') {
      return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
    }
  
  // Count interested leads for specific salesman
  const interestedCount = await Lead.countDocuments({ 
    status: 'intersted', 
    sales_id: sales_id
  });
  
  return SuccessResponse(res, { 
    message: 'Salesman interested leads count retrieved successfully', 
    data: { count: interestedCount }
  }, 200);
});


export const getSalesmanLeadsCount = asyncHandler(async (req, res) => {
  const { sales_id } = req.params;
  
  const salesman = await User.findById(sales_id);
  if (!salesman || salesman.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  const totalLeadsCount = await Lead.countDocuments({ sales_id: sales_id });
  
  return SuccessResponse(res, { 
    message: 'Salesman leads count retrieved successfully', 
    data: {
      salesman: {
        _id: salesman._id,
        name: salesman.name,
        email: salesman.email
      },
      total_leads: totalLeadsCount
    }
  }, 200);
});


export const getSalesTargetsCount = asyncHandler(async (req, res) => {
  const { sales_id } = req.params;
  
  // check sales_id is exist 
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // Count users with role 'Salesman' who have a target assigned
  const salesWithTargetsCount = await User.countDocuments({ 
    role: 'Salesman', 
    target_id: { $exists: true, $ne: null } 
  });
  
  // Count total salesmen
  const totalSalesmenCount = await User.countDocuments({ role: 'Salesman' });
  
  // Count salesmen without targets
  const salesWithoutTargetsCount = totalSalesmenCount - salesWithTargetsCount;
  
  return SuccessResponse(res, { 
    message: 'Sales targets count retrieved successfully', 
    data: {
      with_targets: salesWithTargetsCount,
      without_targets: salesWithoutTargetsCount,
      total_salesmen: totalSalesmenCount
    }
  }, 200);
});


export const getSalesTargetsDetails = asyncHandler(async (req, res) => {
  const { sales_id } = req.params;
  
  // check sales_id is exist 
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  // Get the specific salesman with target information
  const salesWithTargets = await User.findById(sales_id)
    .populate('target_id', 'name point status')
    .select('name email role target_id');

  return SuccessResponse(res, { 
    message: 'Sales targets details retrieved successfully', 
    data: salesWithTargets
  }, 200);
});