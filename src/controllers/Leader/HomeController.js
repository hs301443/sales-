import User from '../../models/modelschema/User.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';

export const view = asyncHandler(async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const sales
    const { name, description, status } = req.body;
    const base64 = req.body.logo_url;
    const folder = 'payment-methods';
    const imageUrl = await saveBase64Image(base64, userId, req, folder);
    const paymentMethod = await PaymentMethod.create({
      name,
      description,
      status,
      logo_url: imageUrl,
    });
    return SuccessResponse(res, { message: 'Payment method created successfully', data: paymentMethod }, 201);
  } catch (error) {
    return ErrorResponse(res, error.message, 400);
  }
});