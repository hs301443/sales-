import User from '../../models/modelschema/User.js';
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

  // check leader_id is exist 
    const leader = await User.findById(leader_id);
    if (!leader || leader.role !== 'Sales Leader') {
        return ErrorResponse(res, 400, { message: 'Invalid leader_id' });
    }

  const sales = await User.create({
    name,
    email,
    password,
    status: status || 'Active',
    role: 'Salesman',
    leader_id: leader_id,
  });

  return SuccessResponse(res, { message: 'Sales created successfully' }, 201);
});

export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await User.find({ role: 'Salesman', isDeleted: false })
    .select('-password -__v -isDeleted')
    .populate('leader_id', 'name')
    .populate('target_id', 'name point status')
    .sort({ created_at: -1 })


   const activeLeaders = await User.find({ 
    role: 'Sales Leader', 
    status: 'Active' 
  })
  .select('_id name email')
  .sort({ name: 1 });

  return SuccessResponse(res, { message: 'Sales retrieved successfully', data: {
      sales,
      leaderOptions: activeLeaders
    }}, 200);
});

export const getSalesById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sales = await User.findOne({ _id: id, isDeleted: false })
  .select('-password -__v -leader_id -isDeleted')
  .populate('leader_id', 'name')
  .populate('target_id', 'name point status')

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
    status,
    leader_id,
  } = req.body;

  sales.name = name || sales.name;
  sales.email = email || sales.email;
  if (password) {
    sales.password = password;
  }

  sales.leader_id = leader_id || sales.leader_id;

  sales.status = status || sales.status;
  await sales.save();

  return SuccessResponse(res, { message: 'Sales updated successfully' }, 200);
});

export const deleteSales = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const sales = await User.findById(id);

  if (!sales || sales.isDeleted) {
    throw new NotFound('Sales not found');
  }

  sales.isDeleted = true;
  await sales.save();

  return SuccessResponse(res, { message: 'Sales deleted successfully' }, 200);
});
