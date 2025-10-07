import Lead from '../../models/modelschema/lead.js'; 
import Activity from '../../models/modelschema/activity.js';
import User from '../../models/modelschema/User.js';
import Source from '../../models/modelschema/Source.js';
import Country from '../../models/modelschema/country.js';
import City from '../../models/modelschema/city.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import salesPoint from '../../models/modelschema/salesPoint.js';
import popupOffer from '../../models/modelschema/popupOffer.js';
import { PopupOfferRead } from '../../models/modelschema/popupOfferRead.js';



export const viewAllLeads = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const baseFilter = {
      sales_id: userId,
      isDeleted: false,
    };

 
    const fetchLeads = async (additionalFilters) => {
      const filter = { ...baseFilter, ...additionalFilters };
      
      const [company_leads, my_leads] = await Promise.all([
        Lead.find({ ...filter, type: 'company' })
          .select('_id name phone address status type created_at')
          .sort({ created_at: -1 })
          .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
          .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } })
          .populate({ path: 'country', select: 'name', match: { isDeleted: false } })
          .populate({ path: 'city', select: 'name', match: { isDeleted: false } }),
        
        Lead.find({ ...filter, type: 'sales' })
          .select('_id name phone address status type created_at')
          .sort({ created_at: -1 })
          .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
          .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } })
          .populate({ path: 'country', select: 'name', match: { isDeleted: false } })
          .populate({ path: 'city', select: 'name', match: { isDeleted: false } }),
      ]);

      return { company_leads, my_leads };
    };

    const [defaultLeads, intersted, negotiation, transfer, demo, approved, rejected] = await Promise.all([
      fetchLeads({
        status: 'default'
      }),
      fetchLeads({
        status: { $in: ['intersted'] },
        transfer: false,
      }),
       fetchLeads({
        status: { $in: ['negotiation'] },
        transfer: false,
      }),
      fetchLeads({
        status: { $in: ['intersted', 'negotiation', 'demo_request', 'demo_done', 'approve', 'reject'] },
        transfer: true,
      }),
      fetchLeads({
        status: { $in: ['demo_request', 'demo_done'] },
      }),
      fetchLeads({
        status: 'approve',
      }),
      fetchLeads({
        status: 'reject',
      })
    ]);

    return res.status(200).json({
      default: defaultLeads,
      intersted,
      negotiation,
      transfer,
      demo,
      approved,
      rejected
    });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});


/*export const viewLead = asyncHandler(async (req, res) => {
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
});*/


export const getLeadById = asyncHandler(async (req, res) => {
  try { 
    const id = req.params.id;
    const lead = await Lead.findOne({ _id: id, isDeleted: false })
      .select('-isDeleted')
      .populate({ path: 'activity_id', select: 'name status', match: { isDeleted: false } })
      .populate({ path: 'source_id', select: 'name status', match: { isDeleted: false } })
      .populate({ path: 'sales_id', select: 'name', match: { isDeleted: false } })
      .populate({ path: 'country', select: 'name', match: { isDeleted: false } })
      .populate({ path: 'city', select: 'name', match: { isDeleted: false } });

    return res.status(200).json({ lead });
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const createLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { name, phone, country, city, activity_id, source_id } = req.body; 

    
    if (!name || !phone || !country || !city || !activity_id) {
      return ErrorResponse(res, 400, { message: 'All fields are required: name, phone, country, city, activity_id' });
    }

    
    const activity = await Activity.findById(activity_id);
    if (!activity) {
      return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
    }


    const countryExists = await Country.findById(country);
    if (!countryExists) {
      return ErrorResponse(res, 400, { message: 'Invalid country' });
    }

    
    const cityExists = await City.findOne({
      _id: city,
      country: country,
      isDeleted: false
    });
    if (!cityExists) {
      return ErrorResponse(res, 400, { message: 'Invalid city or city does not belong to selected country' });
    }

    // Check if phone already exists
    const existingLead = await Lead.findOne({ 
      phone, 
      isDeleted: false 
    });
    if (existingLead) {
      return ErrorResponse(res, 400, { message: 'Lead with this phone number already exists' });
    }

     // Check source_id exists if provided
  if (source_id) {
    const source = await Source.findById(source_id);
    if (!source) {
      return ErrorResponse(res, 400, { message: 'Invalid source_id' });
    }
  }
    
    const lead = await Lead.create({
      name,
      phone,
      country,
      city,
      type: 'sales',
      sales_id: userId,
      status: 'default',
      activity_id,
      source_id
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('country', 'name')
      .populate('city', 'name')
      .populate('activity_id', 'name')
      .populate('source_id', 'name');

    return res.status(201).json({ 
      success: true,
      message: 'Lead created successfully',
      data: populatedLead
    });

  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});

export const updateLead = asyncHandler(async (req, res) => {
    try {
        const userId = req.currentUser.id;
        const id = req.params.id;
        
      
        const lead = await Lead.findById(id);
        
        if (!lead) {
            return ErrorResponse(res, 404, { message: 'Lead not found' });
        }

        
        if (lead.sales_id.toString() !== userId) {
            return ErrorResponse(res, 403, { message: 'You are not authorized to update this lead' });
        }

        const { name, phone, country, city, status, activity_id, source_id } = req.body;

        
        if (activity_id) {
            const activity = await Activity.findById(activity_id);
            if (!activity) {
                return ErrorResponse(res, 400, { message: 'Invalid activity_id' });
            }
        }

      
        if (country) {
            const countryExists = await Country.findById(country);
            if (!countryExists) {
                return ErrorResponse(res, 400, { message: 'Invalid country' });
            }
        }

        
        if (city) {
            const selectedCountry = country || lead.country;
            const cityExists = await City.findOne({
                _id: city,
                country: selectedCountry,
                isDeleted: false
            });
            if (!cityExists) {
                return ErrorResponse(res, 400, { message: 'Invalid city or city does not belong to selected country' });
            }
        }

        
        if (phone && phone !== lead.phone) {
            const existingLead = await Lead.findOne({ 
                phone, 
                isDeleted: false,
                _id: { $ne: id } 
            });
            if (existingLead) {
                return ErrorResponse(res, 400, { message: 'Lead with this phone number already exists' });
            }
        }

        if(source_id) {
          const source = await Source.findById(source_id);
          if(!source) {
            return ErrorResponse(res, 400, { message: 'Invalid source_id' });
          }
        }

        const sourceId = source_id || lead.source_id;

        lead.name = name || lead.name;
        lead.phone = phone || lead.phone;
        lead.country = country || lead.country;
        lead.city = city || lead.city;
        lead.status = status || lead.status;
        lead.activity_id = activity_id || lead.activity_id;
        lead.source_id = sourceId;
        
        await lead.save();

        
        const populatedLead = await Lead.findById(lead._id)
            .populate('country', 'name')
            .populate('city', 'name')
            .populate('activity_id', 'name')
            .populate('source_id', 'name');

        return res.status(200).json({ 
            success: true,
            message: 'Lead updated successfully',
            data: populatedLead
        });

    } catch (error) {
        return ErrorResponse(res, error.message, 400);
    }
});


export const deleteLead = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id; 
    const id = req.params.id; 
    const lead = await Lead.findOne({_id:id, sales_id: userId, type: 'sales'});
  
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
  const sales_id = req.currentUser.id;
  
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
  });
  const NoOfApprove_my_leads = await Lead.countDocuments({
    sales_id: sales_id,
    type: 'sales',
    status: 'approve', 
    isDeleted: false,
  });
  const NoOfReject_company_leads = await Lead.countDocuments({
    sales_id: sales_id,
    type: 'company',
    status: 'reject', 
    isDeleted: false,
  });
  const NoOfReject_my_leads = await Lead.countDocuments({
    sales_id: sales_id,
    type: 'sales',
    status: 'reject', 
    isDeleted: false,
  });
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
  
  const my_target = salesmenWithTargets.length > 0 ? salesmenWithTargets[0].target_id?.point || 0 : 0;
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();
  
  const mySalesPoints = await salesPoint.find({
    sales_id: sales_id,
    month: currentMonth,
    year: currentYear,
    isDeleted: false
  }).select('point').lean();
  
  const my_point = mySalesPoints.reduce((sum, record) => sum + (record.point || 0), 0);
  
  
  const readPopupOfferIds = await PopupOfferRead.find({ 
    sales_id: sales_id,
    isRead: true 
  }).distinct('popup_offer_id');
  
  
  const popupOffers = await popupOffer.find({ 
    status: true,
    isDeleted: false,
    _id: { $nin: readPopupOfferIds } 
  }).sort({ created_at: -1 }).limit(5); 
  
  return SuccessResponse(res, { 
    message: 'Sales targets details retrieved successfully', 
    data: {
      total_leads: totalLeadsCount,
      NoOfApprove_company_leads: NoOfApprove_company_leads,
      NoOfApprove_my_leads: NoOfApprove_my_leads,
      NoOfReject_company_leads: NoOfReject_company_leads,
      NoOfReject_my_leads: NoOfReject_my_leads,
      interestedCount: interestedCount,
      my_target: my_target,
      my_point: my_point,
      popup_offers: popupOffers 
    }
  }, 200);
});


export const getAllCountryAndCity = asyncHandler(async (req, res) => {
  const countries = await Country.find({ isDeleted: false })
    .select('_id name')
    .sort({ name: 1 });
  const cities = await City.find({ isDeleted: false })
    .select('_id name')
    .sort({ name: 1 })
    .populate('country', 'name');

  return SuccessResponse(res, { 
    message: 'Country and City retrieved successfully', 
    data: {
      countries: countries,
      cities: cities
    }
  }, 200);
});


export const getAllSources = asyncHandler(async (req, res) => {
  const sources = await Source.find({ isDeleted: false, status: 'Active' })
    .select('-isDeleted')
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Sources retrieved successfully', data: sources }, 200);
});