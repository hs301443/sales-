import Activity from '../../models/modelschema/activity.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { NotFound } from '../../Errors/NotFound.js';

export const createActivity = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  const activity = await Activity.create({
    name,
    status: status || true,
  });

  return SuccessResponse(res, { message: 'Activity created successfully'}, 201);
});

export const getAllActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({ isDeleted: false })
    .select('-isDeleted')
    .sort({ createdAt: -1 });

  return SuccessResponse(res, { message: 'Activities retrieved successfully', data: activities }, 200);
});

export const getActivityById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const activity = await Activity.findOne({ _id: id, isDeleted: false }).select('-isDeleted');

  if (!activity) {
    throw new NotFound('Activity not found');
  }

  return SuccessResponse(res, { message: 'Activity retrieved successfully', data: activity }, 200);
});

export const updateActivity = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const activity = await Activity.findById(id);

  if (!activity) {
    throw new ErrorResponse('Activity not found', 404);
  }

  const { name, status } = req.body;

  activity.name = name || activity.name;
  activity.status = status !== undefined ? status : activity.status;

  await activity.save();

  return SuccessResponse(res, { message: 'Activity updated successfully'}, 200);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const activity = await Activity.findById(id);

  if (!activity || activity.isDeleted) {
    throw new ErrorResponse('Activity not found', 404);
  }

  activity.isDeleted = true;
  await activity.save();

  return SuccessResponse(res, { message: 'Activity deleted successfully'}, 200);
});