import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { NotFound } from '../../Errors/NotFound.js';

export const createActivity = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  await prisma.activity.create({ data: { name, status: status ?? 'Active' } });
  return SuccessResponse(res, { message: 'Activity created successfully'}, 201);
});

export const getAllActivities = asyncHandler(async (req, res) => {
  const activities = await prisma.activity.findMany({
    where: { isDeleted: false },
    orderBy: { id: 'desc' }
  });
  return SuccessResponse(res, { message: 'Activities retrieved successfully', data: activities }, 200);
});

export const getActivityById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const activity = await prisma.activity.findFirst({ where: { id, isDeleted: false } });
  if (!activity) throw new NotFound('Activity not found');
  return SuccessResponse(res, { message: 'Activity retrieved successfully', data: activity }, 200);
});

export const updateActivity = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.activity.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new ErrorResponse('Activity not found', 404);
  const { name, status } = req.body;
  await prisma.activity.update({ where: { id }, data: { name: name ?? undefined, status: status ?? undefined } });
  return SuccessResponse(res, { message: 'Activity updated successfully'}, 200);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.activity.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new ErrorResponse('Activity not found', 404);
  await prisma.activity.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Activity deleted successfully'}, 200);
});