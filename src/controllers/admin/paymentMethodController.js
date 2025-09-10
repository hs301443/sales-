import { saveBase64Image } from '../../utils/handleImages.js';
import PaymentMethod from '../../models/modelschema/PaymentMethod.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { NotFound } from '../../Errors/NotFound.js';

export const createPaymentMethod = asyncHandler(async (req, res) => {
 
    const userId = req.currentUser.id;
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

});

export const getAllPaymentMethods = asyncHandler(async (req, res) => {
  
    const paymentMethods = await PaymentMethod.find()
      .sort({ createdAt: -1 });
    return SuccessResponse(res, { message: 'Payment methods retrieved successfully', data: paymentMethods }, 200);
 
});

export const getPaymentMethodById = asyncHandler(async (req, res) => {
  
    const id = req.params.id;
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      throw new NotFound('Payment method not found');
    }
    return SuccessResponse(res, { message: 'Payment method retrieved successfully', data: paymentMethod }, 200);

});

export const updatePaymentMethod = asyncHandler(async (req, res) => {
 
    const id = req.params.id;
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      throw new NotFound('Payment method not found', 404);
    }
    const { name, description, status } = req.body;
    const base64 = req.body.logo_url;
    if (base64) {
      const folder = 'payment-methods';
      const imageUrl = await saveBase64Image(base64, req.currentUser.id, req, folder);
      paymentMethod.logo_url = imageUrl;
    }
    paymentMethod.name = name || paymentMethod.name;
    paymentMethod.description = description || paymentMethod.description;
    paymentMethod.status = status || paymentMethod.status;
    await paymentMethod.save();
    return SuccessResponse(res, { message: 'Payment method updated successfully', data: paymentMethod }, 200);
  
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
 
    const id = req.params.id;
    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
    if (!paymentMethod) {
      throw new NotFound('Payment method not found');
    }
    return SuccessResponse(res, { message: 'Payment method deleted successfully' }, 200);

});