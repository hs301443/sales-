import prisma from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createSales = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    status,
    leader_id,
  } = req.body;

  const leader = await prisma.user.findUnique({ where: { id: Number(leader_id) } });
  if (!leader || leader.role !== 'Sales_Leader') {
    return ErrorResponse(res, 400, { message: 'Invalid leader_id' });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      status: status || 'Active',
      role: 'Salesman',
      leader_id: Number(leader_id),
    }
  });

  return SuccessResponse(res, { message: 'Sales created successfully' }, 201);
});

export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await prisma.user.findMany({
    where: { role: 'Salesman', isDeleted: false },
    orderBy: { created_at: 'desc' },
    select: {
      id: true, name: true, email: true, status: true, created_at: true,
      leader: { select: { id: true, name: true } },
      target: { select: { id: true, name: true, point: true, status: true } },
    }
  });

  const activeLeaders = await prisma.user.findMany({
    where: { role: 'Sales_Leader', status: 'Active', isDeleted: false },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true }
  });

  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: {
      sales,
      leaderOptions: activeLeaders
    }}, 200);
});

export const getSalesById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const sales = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true, name: true, email: true, status: true, created_at: true,
      leader: { select: { id: true, name: true } },
      target: { select: { id: true, name: true, point: true, status: true } },
    }
  });
  if (!sales) throw new NotFound('Sales not found');
  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: sales }, 200);
});

export const updateSales = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Sales not found');

  const { name, email, password, status, leader_id } = req.body;
  const data = {
    name: name ?? undefined,
    email: email ?? undefined,
    status: status ?? undefined,
    leader_id: leader_id ? Number(leader_id) : undefined,
  };
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { id }, data });
  return SuccessResponse(res, { message: 'Sales updated successfully' }, 200);
});

export const deleteSales = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const sales = await prisma.user.findUnique({ where: { id } });
  if (!sales || sales.isDeleted) throw new NotFound('Sales not found');
  await prisma.user.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Sales deleted successfully' }, 200);
});
