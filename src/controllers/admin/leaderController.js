import prisma from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createLeader = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    status,
  } = req.body;

  //check if email exist
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists',
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'Sales_Leader',
      status: status || 'Active',
    }
  });

  return SuccessResponse(res, { message: 'Leader created successfully' }, 201);
});

export const getAllLeaders = asyncHandler(async (req, res) => {
  const leaders = await prisma.user.findMany({
    where: { role: 'Sales_Leader', isDeleted: false },
    orderBy: { created_at: 'desc' },
    select: {
      id: true, name: true, email: true, status: true, created_at: true,
      target: { select: { id: true, name: true, point: true, status: true } },
    }
  });

  return SuccessResponse(res, { message: 'Leaders retrieved successfully', data: leaders }, 200);
});

export const getLeaderById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const leader = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true, name: true, email: true, status: true, created_at: true,
      target: { select: { id: true, name: true, point: true, status: true } },
    }
  });
  if (!leader) throw new NotFound('Leader not found');
  return SuccessResponse(res, { message: 'Leader retrieved successfully', data : [leader] }, 200);
});

export const updateLeader = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) throw new NotFound('Leader not found');

  const { name, email, password, status } = req.body;
  const data = {
    name: name ?? undefined,
    email: email ?? undefined,
    role: 'Sales_Leader',
    status: status ?? undefined,
  };
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({ where: { id }, data });
  return SuccessResponse(res, { message: 'Leader updated successfully' }, 200);
});

export const deleteLeader = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const leader = await prisma.user.findUnique({ where: { id } });
  if (!leader || leader.isDeleted) throw new NotFound('Leader not found');
  await prisma.user.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'Leader deleted successfully' }, 200);
});