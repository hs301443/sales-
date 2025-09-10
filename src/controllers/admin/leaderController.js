import User from '../../models/modelschema/User.js';
import asyncHandler from 'express-async-handler';
import { NotFound } from '../../Errors/NotFound.js'
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createLeader = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    status,
  } = req.body;

  //check if email exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists',
    });
  }

  const leader = await User.create({
    name,
    email,
    password,
    role: 'Sales Leader',
    status: status || 'Active',
  });

  User.leader_id = leader._id;

  await leader.save(); 

  return SuccessResponse(res, { message: 'Leader created successfully' }, 201);
});

export const getAllLeaders = asyncHandler(async (req, res) => {
  const leaders = await User.find({ role: 'Sales Leader' })
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Leaders retrieved successfully', data: leaders }, 200);
});

export const getLeaderById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const leader = await User.findById(id);

  if (!leader) {
    throw new NotFound('Leader not found');
  }

  return SuccessResponse(res, { message: 'Leader retrieved successfully', data : [leader] }, 200);
});

export const updateLeader = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const leader = await User.findById(id);

  if (!leader) {
    throw new NotFound('Leader not found');
  }

  const {
    name,
    email,
    password,
    role,
    status,
  } = req.body;

  leader.name = name || leader.name;
  leader.email = email || leader.email;
  if (password) {
    leader.password = password;
  }
  leader.role = 'Sales Leader';
  leader.status = status || leader.status;

  await leader.save();

  return SuccessResponse(res, { message: 'Leader updated successfully' }, 200);
});

export const deleteLeader = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const leader = await User.findByIdAndDelete(id);

  if (!leader) {
    throw new NotFound('Leader not found');
  }

  return SuccessResponse(res, { message: 'Leader deleted successfully' }, 200);
});