import Target from '../../models/modelschema/Target.js';
import asyncHandler from 'express-async-handler'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createTarget = asyncHandler(async (req, res) => {
  const { name, point, status } = req.body;

  const target = await Target.create({
    name,
    point,
    status: status || 'Active',
  });

  return SuccessResponse(res, { message: 'Target created successfully'}, 201);
});

export const getAllTargets = asyncHandler(async (req, res) => {
  const targets = await Target.find({ isDeleted: false })
    .select('-isDeleted')
    //.populate('user_id', 'name email role')
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Targets retrieved successfully', data: targets }, 200);
});

export const getTargetById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const target = await Target.findOne({ _id: id, isDeleted: false }).select('-isDeleted');

  if (!target) {
    throw new ErrorResponse('Target not found', 404);
  }

  return SuccessResponse(res, { message: 'Target retrieved successfully', data: target }, 200);
});

export const updateTarget = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const target = await Target.findById(id);

  if (!target) {
    throw new ErrorResponse('Target not found', 404);
  }

  const { name, point, status } = req.body;

  target.name = name || target.name;
  target.point = point || target.point;
  target.status = status || target.status;

  await target.save();

  return SuccessResponse(res, { message: 'Target updated successfully'}, 200);
});


export const deleteTarget = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const target = await Target.findById(id);

  if (!target || target.isDeleted) {
    throw new ErrorResponse('Target not found', 404);
  }

  target.isDeleted = true;
  await target.save();

  return SuccessResponse(res, { message: 'Target deleted successfully'}, 200);
});
