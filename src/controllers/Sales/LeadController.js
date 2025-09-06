import Lead from '../../models/modelschema/Lead.js'; 
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
