import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../../models/modelschema/User.js';
import { BadRequest } from '../../Errors/BadRequest.js';
import { SuccessResponse } from '../../utils/response.js';
import  { generateJWT }  from '../../middlewares/generateJWT.js';


/*export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new BadRequest('Incorrect email or password');
  }

 const token = await generateJWT({id: user.id, role: user.role});

  return SuccessResponse(res, { message: 'User logged in successfully', token, role: user.role, name: user.name, email: user.email}, 200);
});*/

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email, isDeleted: false });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new BadRequest('Incorrect email or password');
  }

  const token = await generateJWT({ id: user.id, role: user.role });

  return SuccessResponse(res, { message: 'User logged in successfully', token, role: user.role, name: user.name, email: user.email }, 200);
});