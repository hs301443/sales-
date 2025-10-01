import Lead from '../../models/modelschema/lead.js'; 
import Activity from '../../models/modelschema/activity.js';
import User from '../../models/modelschema/user.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const viewLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const company_leads = await Lead.find({sales_id: userId,
      type: 'company',
      status: {$in:['intersted', 'negotiation']},
      transfer: false,
      isDeleted: false,
    })
    .select('_id name phone address status type created_at')
    .sort({ created_at: -1 })
    .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['intersted', 'negotiation']},
      transfer: false,
      isDeleted: false,
    })
    .select('_id name phone address status type created_at')
    .sort({ created_at: -1 }) 
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });

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
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['intersted', 'negotiation']},
      transfer: true,
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });

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
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['demo_request', 'demo_done']},
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });

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
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: 'approve', 
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });

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
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: 'reject', 
      isDeleted: false,
    })
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 }) 
    .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } });

    return res.status(200).json({ company_leads, my_leads });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const getLeadById = asyncHandler(async (req, res) => {
  try { 
    const id = req.params.id;
    const lead = await Lead.findOne({ _id: id, isDeleted: false })
      .select('-isDeleted')
      .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } })
      .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
      .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } });

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
    const id = req.params.id;
    
    // Find the lead by ID
    const lead = await Lead.findById(id);
    
    if (!lead) {
        throw new NotFound('Lead not found');
    }

    // Check if the lead belongs to the current sales user
    if (lead.sales_id.toString() !== userId) {
        return ErrorResponse(res, 403, { message: 'You are not authorized to update this lead' });
    }

    const { name, phone, address, status, activity_id } = req.body;

    // Validate activity_id if provided
    if (activity_id) {
        const activity = await Activity.findById(activity_id);
        if (!activity) {
            return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
        }
    }

    // Update lead fields
    lead.name = name || lead.name;
    lead.phone = phone || lead.phone;
    lead.address = address || lead.address;
    lead.status = status || lead.status;
    lead.activity_id = activity_id || lead.activity_id;
    
    await lead.save();

    return res.status(200).json({ 'success': 'You updated lead successfully' });
});

export const deleteLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id; 
    const id = req.body.id; 
    const lead = await Lead.findOne({_id:id, sales_id: userId});
  
    if (!lead) {
      throw new NotFound('Lead not found');
    }

    lead.isDeleted = true;
    await lead.save();

    return res.status(200).json({ 'success': 'You delete lead success' });
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

  const salesmenWithTargets = await User.find({
    _id: sales_id, 
    target_id: { $exists: true, $ne: null } 
  }).populate('target_id');

  // Calculate total target value
  const totalTarget = salesmenWithTargets.reduce((sum, salesman) => {
    return sum + (salesman.target_id?.point || 0);
  }, 0);
  
  return SuccessResponse(res, { 
    message: 'Sales targets count retrieved successfully', 
    data: {
      total_target: totalTarget
    }
  }, 200);
});


export const getSalesTargetsDetails = asyncHandler(async (req, res) => {
  const  sales_id  = req.currentUser.id;
  
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



export const HomeSales = asyncHandler(async (req, res) => {
  const  sales_id  = req.currentUser.id;
  
  // check sales_id is exist 
  const sales = await User.findById(sales_id);
  if (!sales || sales.role !== 'Salesman') {
    return ErrorResponse(res, 400, { message: 'Invalid sales_id' });
  }

  const totalLeadsCount = await Lead.countDocuments({ sales_id: sales_id });

   const NoOfApprove_company_leads = await Lead.countDocuments({
     sales_id: sales_id,
      type: 'company',
      status: 'approve', 
      isDeleted: false,
    })

    const NoOfApprove_my_leads = await Lead.countDocuments({
      sales_id: sales_id,
      type: 'sales',
      status: 'approve', 
      isDeleted: false,
    })

  const NoOfReject_company_leads = await Lead.countDocuments({
      sales_id: sales_id,
      type: 'company',
      status: 'reject', 
      isDeleted: false,
    })

    const NoOfReject_my_leads = await Lead.countDocuments({
      sales_id: sales_id,
      type: 'sales',
      status: 'reject', 
      isDeleted: false,
    })

    const interestedCount = await Lead.countDocuments({ 
    status: 'intersted', 
    sales_id: sales_id
  });
  
  const salesmenWithTargets = await User.find({
    _id: sales_id, 
    target_id: { $exists: true, $ne: null } 
  }).populate('target_id');

  const totalTarget = salesmenWithTargets.reduce((sum, salesman) => {
    return sum + (salesman.target_id?.point || 0);
  }, 0);
  

  return SuccessResponse(res, { 
    message: 'Sales targets details retrieved successfully', 
    data: {
      total_leads: totalLeadsCount,
      NoOfApprove_company_leads: NoOfApprove_company_leads,
      NoOfApprove_my_leads: NoOfApprove_my_leads,
      NoOfReject_company_leads: NoOfReject_company_leads,
      NoOfReject_my_leads: NoOfReject_my_leads,
      interestedCount: interestedCount,
      total_target: totalTarget
    }
  }, 200);
});
