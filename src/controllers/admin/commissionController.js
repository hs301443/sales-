import Commission from '../../models/modelschema/commision.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createCommission = asyncHandler(async (req, res) => {
  const {
    point_threshold,
    amount,
    type,
    level_name
  } = req.body;

  // Check if commission level with same point threshold already exists
  const existingCommission = await Commission.findOne({ point_threshold });
  if (existingCommission) {
    return ErrorResponse(res, 400, { message: 'Commission level with this point threshold already exists' });
  }

  const commission = await Commission.create({
    point_threshold,
    amount,
    type,
    level_name
  });

  return SuccessResponse(res, { message: 'Commission created successfully', data: commission }, 201);
});

export const getAllCommissions = asyncHandler(async (req, res) => {
  const commissions = await Commission.find({ isDeleted: false }).select('-isDeleted').sort({ point_threshold: 1 });

  return SuccessResponse(res, { message: 'Commissions retrieved successfully', data: commissions }, 200);
});

export const getCommissionById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const commission = await Commission.findOne({ _id: id, isDeleted: false }).select('-isDeleted');

  if (!commission) {
    throw new NotFound('Commission not found');
  }

  return SuccessResponse(res, { message: 'Commission retrieved successfully', data: commission }, 200);
});

export const updateCommission = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const commission = await Commission.findById(id);

  if (!commission) {
    throw new NotFound('Commission not found');
  }

  const {
    point_threshold,
    amount,
    type,
    level_name
  } = req.body;

  // Check if point_threshold is being updated and if it conflicts with another commission
  if (point_threshold && point_threshold !== commission.point_threshold) {
    const existingCommission = await Commission.findOne({ 
      point_threshold, 
      _id: { $ne: id } 
    });
    if (existingCommission) {
      return ErrorResponse(res, 400, { message: 'Commission level with this point threshold already exists' });
    }
    commission.point_threshold = point_threshold;
  }

  if (amount !== undefined) commission.amount = amount;
  if (type) commission.type = type;
  if (level_name) commission.level_name = level_name;

  await commission.save();

  return SuccessResponse(res, { message: 'Commission updated successfully', data: commission }, 200);
});

export const deleteCommission = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const commission = await Commission.findById(id);

  if (!commission || commission.isDeleted) {
    throw new NotFound('Commission not found');
  }

  commission.isDeleted = true;
  await commission.save();

  return SuccessResponse(res, { message: 'Commission deleted successfully' }, 200);
});

export const getCommissionByPoints = asyncHandler(async (req, res) => {
  const { points } = req.params;
  const numericPoints = parseInt(points);

  if (isNaN(numericPoints)) {
    return ErrorResponse(res, 400, { message: 'Invalid points value' });
  }

  // Find the commission level where point_threshold is <= the given points
  // and get the highest threshold that meets the criteria
  const commission = await Commission.findOne({
    point_threshold: { $lte: numericPoints }
  }).sort({ point_threshold: -1 });

  if (!commission) {
    return ErrorResponse(res, 404, { message: 'No commission level found for the given points' });
  }

  return SuccessResponse(res, { 
    message: 'Commission retrieved successfully', 
    data: commission 
  }, 200);
});