import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import User from '../../models/modelschema/User.js';
import { BadRequest } from '../../Errors/BadRequest.js';
import { SuccessResponse } from '../../utils/response.js';


export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new BadRequest('Incorrect email or password');
  }

//  const token = user.getSignedJwtToken();

  return SuccessResponse(res, { message: 'User logged in successfully'}, 200);
});