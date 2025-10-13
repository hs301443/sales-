import prisma from '../../lib/prisma.js';
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
  const existingCommission = await prisma.commission.findFirst({ where: { point_threshold: Number(point_threshold) } });
  if (existingCommission) {
    return ErrorResponse(res, 400, { message: 'Commission level with this point threshold already exists' });
  }

  const commission = await prisma.commission.create({
    data: {
      point_threshold: Number(point_threshold),
      amount: Number(amount),
      type,
      level_name,
    }
  });

  return SuccessResponse(res, { message: 'Commission created successfully', data: commission }, 201);
});

export const getAllCommissions = asyncHandler(async (req, res) => {
  const commissions = await prisma.commission.findMany({ where: { isDeleted: false }, orderBy: { point_threshold: 'asc' } });

  return SuccessResponse(res, { message: 'Commissions retrieved successfully', data: commissions }, 200);
});

export const getCommissionById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const commission = await prisma.commission.findFirst({ where: { id, isDeleted: false } });

  if (!commission) {
    throw new NotFound('Commission not found');
  }

  return SuccessResponse(res, { message: 'Commission retrieved successfully', data: commission }, 200);
});

export const updateCommission = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const commission = await prisma.commission.findUnique({ where: { id } });

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
  if (point_threshold && Number(point_threshold) !== commission.point_threshold) {
    const existingCommission = await prisma.commission.findFirst({ where: { point_threshold: Number(point_threshold), NOT: { id } } });
    if (existingCommission) {
      return ErrorResponse(res, 400, { message: 'Commission level with this point threshold already exists' });
    }
  }
  const updated = await prisma.commission.update({
    where: { id },
    data: {
      point_threshold: point_threshold !== undefined ? Number(point_threshold) : undefined,
      amount: amount !== undefined ? Number(amount) : undefined,
      type: type ?? undefined,
      level_name: level_name ?? undefined,
    }
  });

  return SuccessResponse(res, { message: 'Commission updated successfully', data: updated }, 200);
});

export const deleteCommission = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const commission = await prisma.commission.findUnique({ where: { id } });

  if (!commission || commission.isDeleted) {
    throw new NotFound('Commission not found');
  }

  await prisma.commission.update({ where: { id }, data: { isDeleted: true } });
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
  const commission = await prisma.commission.findFirst({
    where: { point_threshold: { lte: numericPoints } },
    orderBy: { point_threshold: 'desc' }
  });

  if (!commission) {
    return ErrorResponse(res, 404, { message: 'No commission level found for the given points' });
  }

  return SuccessResponse(res, { 
    message: 'Commission retrieved successfully', 
    data: commission 
  }, 200);
});