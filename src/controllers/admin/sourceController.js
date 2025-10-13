import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createSource = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  await prisma.source.create({ data: { name, status: status || 'Active' } });
  return SuccessResponse(res, { message: 'Source created successfully'}, 201);
});

export const getAllSources = asyncHandler(async (req, res) => {
  const sources = await prisma.source.findMany({ where: { isDeleted: false }, orderBy: { created_at: 'desc' } });
  return SuccessResponse(res, { message: 'Sources retrieved successfully', data: sources }, 200);
});


export const getSourceById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const source = await prisma.source.findFirst({ where: { id, isDeleted: false } });
  if (!source) throw new ErrorResponse('Source not found', 404);
  return SuccessResponse(res, { message: 'Source retrieved successfully', data: source }, 200);
});

export const updateSource = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.source.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new ErrorResponse('Source not found', 404);
  const { name, status } = req.body;
  await prisma.source.update({ where: { id }, data: { name: name ?? undefined, status: status ?? undefined } });
  return SuccessResponse(res, { message: 'Source updated successfully'}, 200);
});


export const deleteSource = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.source.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new ErrorResponse('Source not found', 404);
  await prisma.source.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Source deleted successfully'}, 200);
});
