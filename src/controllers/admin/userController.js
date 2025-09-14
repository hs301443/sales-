import User from '../../models/modelschema/User.js'
import Target from '../../models/modelschema/Target.js';
import asyncHandler from 'express-async-handler'
import { NotFound } from '../../Errors/NotFound.js';
import { BadRequest } from '../../Errors/BadRequest.js';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, status, target_id } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequest('User with this email already exists');
  }
  
  // check if target_id is exist 
  const target = await Target.findById(target_id);
  if (!target) {
    throw new NotFound('Target not found');
  }

  //check role is valid
  const validRoles = ['Salesman', 'Sales Leader', 'Admin'];
  if (!validRoles.includes(role)) {
    throw new BadRequest('Invalid role specified');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    status: status || 'Active',
    target_id
  });

  const userResponse = user.toObject();

  return SuccessResponse(res, { message: 'User created successfully' }, 201);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password -__v')
    .populate('target_id', 'name point status')
    .populate('leader_id', 'name') 
    .sort({ created_at: -1 });

  return SuccessResponse(res, { message: 'Users retrieved successfully', data: users }, 200);
});

export const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id)
    .select('-password -__v')
    .populate('target_id', 'name point status')
    .populate('leader_id', 'name') 
    .populate('target_id', 'name point status');

  if (!user) {
    throw new NotFound('User not found');
  }

  const userResponse = user.toObject();

  return SuccessResponse(res, { message: 'User retrieved successfully', data: userResponse }, 200);
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    throw new NotFound('User not found');
  }

  const { name, email, password, role, status, target_id } = req.body;

  // check if target_id is exist
  if (target_id) {
    const target = await Target.findById(target_id);
    if (!target) {
      throw new NotFound('Target not found');
    }
  }

  // check role is valid
  const validRoles = ['Salesman', 'Sales Leader', 'Admin'];
  if (role && !validRoles.includes(role)) {
    throw new BadRequest('Invalid role specified');
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password || user.password;
  user.role = role || user.role;
  user.status = status || user.status;
  user.target_id = target_id || user.target_id;

  await user.save();

  const userResponse = user.toObject();

  return SuccessResponse(res, { message: 'User updated successfully' }, 200);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new NotFound('User not found');
  }

  return SuccessResponse(res, { message: 'User deleted successfully' }, 200);
});