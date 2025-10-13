import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createTarget = asyncHandler(async (req, res) => {
  const { name, point, status } = req.body;

  await prisma.target.create({ data: { name, point: Number(point), status: status || 'Active' } });
  return SuccessResponse(res, { message: 'Target created successfully'}, 201);
});

export const getAllTargets = asyncHandler(async (req, res) => {
  const targets = await prisma.target.findMany({ where: { isDeleted: false }, orderBy: { id: 'desc' } });
  return SuccessResponse(res, { message: 'Targets retrieved successfully', data: targets }, 200);
});

export const getTargetById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const target = await prisma.target.findFirst({ where: { id, isDeleted: false } });
  if (!target) throw new ErrorResponse('Target not found', 404);
  return SuccessResponse(res, { message: 'Target retrieved successfully', data: target }, 200);
});

export const updateTarget = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.target.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new ErrorResponse('Target not found', 404);
  const { name, point, status } = req.body;
  await prisma.target.update({ where: { id }, data: { name: name ?? undefined, point: point !== undefined ? Number(point) : undefined, status: status ?? undefined } });
  return SuccessResponse(res, { message: 'Target updated successfully'}, 200);
});


export const deleteTarget = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.target.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new ErrorResponse('Target not found', 404);
  await prisma.target.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Target deleted successfully'}, 200);
});
