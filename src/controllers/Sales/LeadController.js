import Lead from '../../models/modelschema/lead.js'; 
import Activity from '../../models/modelschema/Activity.js';
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
    .select('_id name phone address status created_at')
    .sort({ created_at: -1 })
    .populate('source_id')
    .populate('activity_id');
    const my_leads = await Lead.find({sales_id: userId,
      type: 'sales',
      status: {$in:['intersted', 'negotiation']},
      transfer: false,
    })
    .select('_id name phone address status created_at')
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
  try {
    const userId = req.currentUser.id;
    const {name, phone, address, activity_id} = req.body
    const activity = await Activity.findById(activity_id);
    if (!activity) {
        return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }
    const lead = await Lead.findOne({_id: id, sales_id: userId});
  
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