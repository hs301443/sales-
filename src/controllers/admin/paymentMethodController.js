import { saveBase64Image } from '../../utils/handleImages.js';
import prisma from '../../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { NotFound } from '../../Errors/NotFound.js';

export const createPaymentMethod = asyncHandler(async (req, res) => {
 
    const userId = req.currentUser.id;
    const { name, description, status } = req.body;
    const base64 = req.body.logo_url;
    const folder = 'payment-methods';
    const imageUrl = await saveBase64Image(base64, userId, req, folder);
    const paymentMethod = await prisma.paymentMethod.create({
      data: { name, description, status: status?.toString(), logo_url: imageUrl }
    });
    return SuccessResponse(res, { message: 'Payment method created successfully', data: paymentMethod }, 201);

});

export const getAllPaymentMethods = asyncHandler(async (req, res) => {
  
    const paymentMethods = await prisma.paymentMethod.findMany({ where: { isDeleted: false }, orderBy: { id: 'desc' } });
    return SuccessResponse(res, { message: 'Payment methods retrieved successfully', data: paymentMethods }, 200);
 
});

export const getPaymentMethodById = asyncHandler(async (req, res) => {
  
    const id = Number(req.params.id);
    const paymentMethod = await prisma.paymentMethod.findFirst({ where: { id, isDeleted: false } });
    if (!paymentMethod) {
      throw new NotFound('Payment method not found');
    }
    return SuccessResponse(res, { message: 'Payment method retrieved successfully', data: paymentMethod }, 200);

});

export const updatePaymentMethod = asyncHandler(async (req, res) => {
 
    const id = Number(req.params.id);
    const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });
    if (!paymentMethod) {
      throw new NotFound('Payment method not found', 404);
    }
    const { name, description, status } = req.body;
    const base64 = req.body.logo_url;
    if (base64) {
      const folder = 'payment-methods';
      const imageUrl = await saveBase64Image(base64, req.currentUser.id, req, folder);
      await prisma.paymentMethod.update({ where: { id }, data: { logo_url: imageUrl } });
    }
    const updated = await prisma.paymentMethod.update({ where: { id }, data: {
      name: name ?? undefined,
      description: description ?? undefined,
      status: status ?? undefined,
    }});
    return SuccessResponse(res, { message: 'Payment method updated successfully', data: updated }, 200);
  
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
 
    const id = Number(req.params.id);
    const paymentMethod = await prisma.paymentMethod.findUnique({ where: { id } });
    if (!paymentMethod || paymentMethod.isDeleted) {
      throw new NotFound('Payment method not found');
    }
    await prisma.paymentMethod.update({ where: { id }, data: { isDeleted: true } });
    return SuccessResponse(res, { message: 'Payment method deleted successfully' }, 200);

});