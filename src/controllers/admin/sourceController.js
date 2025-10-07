import Source from '../../models/modelschema/Source.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createSource = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  const source = await Source.create({
    name,
    status: status || 'Active',
  });

  return SuccessResponse(res, { message: 'Source created successfully'}, 201);
});

export const getAllSources = asyncHandler(async (req, res) => {
  const sources = await Source.find({ isDeleted: false })
    .select('-isDeleted')
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Sources retrieved successfully', data: sources }, 200);
});


export const getSourceById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const source = await Source.findOne({ _id: id, isDeleted: false }).select('-isDeleted');

  if (!source) {
    throw new ErrorResponse('Source not found', 404);
  }

  return SuccessResponse(res, { message: 'Source retrieved successfully', data: source }, 200);
});

export const updateSource = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const source = await Source.findById(id);

  if (!source) {
    throw new ErrorResponse('Source not found', 404);
  }

  const { name, status } = req.body;

  source.name = name || source.name;
  source.status = status || source.status;

  await source.save();

  return SuccessResponse(res, { message: 'Source updated successfully'}, 200);
});


export const deleteSource = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const source = await Source.findById(id);

  if (!source || source.isDeleted) {
    throw new ErrorResponse('Source not found', 404);
  }

  source.isDeleted = true;
  await source.save();

  return SuccessResponse(res, { message: 'Source deleted successfully'}, 200);
});
