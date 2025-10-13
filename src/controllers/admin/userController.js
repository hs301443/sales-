import prisma from '../../lib/prisma.js'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import asyncHandler from 'express-async-handler'
import { NotFound } from '../../Errors/NotFound.js';
import { BadRequest } from '../../Errors/BadRequest.js';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, status, target_id } = req.body;

  const validRoles = ['Salesman', 'Sales Leader', 'Admin'];
  if (!validRoles.includes(role)) {
    throw new BadRequest('Invalid role specified');
  }

  const targetIfProvided = target_id
    ? await prisma.target.findUnique({ where: { id: Number(target_id) } })
    : null;
  if (target_id && !targetIfProvided) {
    throw new NotFound('Target not found');
  }

  const existing = await prisma.user.findFirst({ where: { email, isDeleted: false } });
  if (existing) {
    throw new BadRequest('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role === 'Sales Leader' ? 'Sales_Leader' : role,
      status: status || 'Active',
      target_id: target_id ? Number(target_id) : null,
    },
  });

  return SuccessResponse(res, { message: 'User created successfully' }, 201);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { isDeleted: false },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      created_at: true,
      target: { select: { id: true, name: true, point: true, status: true } },
      leader: { select: { id: true, name: true } },
    },
  });

  return SuccessResponse(res, { message: 'Users retrieved successfully', data: users }, 200);
});

export const getUserById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findFirst({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      created_at: true,
      target: { select: { id: true, name: true, point: true, status: true } },
      leader: { select: { id: true, name: true } },
    },
  });

  if (!user) {
    throw new NotFound('User not found');
  }

  return SuccessResponse(res, { message: 'User retrieved successfully', data: user }, 200);
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) {
    throw new NotFound('User not found');
  }

  const { name, email, password, role, status, target_id } = req.body;

  if (target_id) {
    const t = await prisma.target.findUnique({ where: { id: Number(target_id) } });
    if (!t) throw new NotFound('Target not found');
  }

  const validRoles = ['Salesman', 'Sales Leader', 'Admin'];
  if (role && !validRoles.includes(role)) {
    throw new BadRequest('Invalid role specified');
  }

  const data = {
    name: name ?? undefined,
    email: email ?? undefined,
    role: role ? (role === 'Sales Leader' ? 'Sales_Leader' : role) : undefined,
    status: status ?? undefined,
    target_id: target_id !== undefined ? Number(target_id) : undefined,
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({ where: { id }, data });

  return SuccessResponse(res, { message: 'User updated successfully' }, 200);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.isDeleted) {
    throw new NotFound('User not found');
  }

  await prisma.user.update({ where: { id }, data: { isDeleted: true } });
  return SuccessResponse(res, { message: 'User deleted successfully' }, 200);
});