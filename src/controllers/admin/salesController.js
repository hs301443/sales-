import User from '../../models/modelschema/User.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createSales = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    leader_id,
  } = req.body;

  // check leader_id is exist 
    const leader = await User.findById(leader_id);
    if (!leader || leader.role !== 'Sales Leader') {
        return ErrorResponse(res, 400, { message: 'Invalid leader_id' });
    }

  const sales = await User.create({
    name,
    email,
    password,
    role: 'Salesman',
    leader_id: leader_id,
  });

  return SuccessResponse(res, { message: 'Sales created successfully' }, 201);
});

export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await User.find({ role: 'Salesman' })
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: sales }, 200);
});

export const getSalesById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sales = await User.findById(id);

  if (!sales) {
    throw new NotFound('Sales not found');
  }

  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: sales }, 200);
});

export const updateSales = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sales = await User.findById(id);

  if (!sales) {
    throw new NotFound('Sales not found');
  }

  const {
    name,
    email,
    password,
    leader_id,
  } = req.body;

  sales.name = name || sales.name;
  sales.email = email || sales.email;
  if (password) {
    sales.password = password;
  }
  sales.leader_id = leader_id || sales.leader_id;

  await sales.save();

  return SuccessResponse(res, { message: 'Sales updated successfully' }, 200);
});

export const deleteSales = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sales = await User.findByIdAndDelete(id);

  if (!sales) {
    throw new NotFound('Sales not found');
  }

  return SuccessResponse(res, { message: 'Sales deleted successfully' }, 200);
});
