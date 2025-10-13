import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import prisma from '../../lib/prisma.js';




export const markPopupOfferAsRead = asyncHandler(async (req, res) => {
  const sales_id = req.currentUser.id;
  const { popup_offer_id } = req.body;

  if (!popup_offer_id) {
    return ErrorResponse(res, 400, { message: 'Popup offer ID is required' });
  }

  const popupOfferExists = await prisma.popupOffer.findFirst({ where: { id: Number(popup_offer_id), status: true, isDeleted: false } });
  
  if (!popupOfferExists) {
    return ErrorResponse(res, 404, { message: 'Popup offer not found' });
  }

  const readRecord = await prisma.popupOfferRead.upsert({
    where: { sales_id_popup_offer_id: { sales_id: Number(sales_id), popup_offer_id: Number(popup_offer_id) } },
    update: { isRead: true, read_at: new Date() },
    create: { sales_id: Number(sales_id), popup_offer_id: Number(popup_offer_id), isRead: true, read_at: new Date() },
  });

  return SuccessResponse(res, { 
    message: 'Popup offer marked as read successfully', 
    data: readRecord
  }, 200);
});