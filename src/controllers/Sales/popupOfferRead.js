import asyncHandler from 'express-async-handler';
import { SuccessResponse, ErrorResponse } from '../../utils/response.js';
import { PopupOfferRead } from '../../models/modelschema/popupOfferRead.js';
import PopupOffer from '../../models/modelschema/popupOffer.js';




export const markPopupOfferAsRead = asyncHandler(async (req, res) => {
  const sales_id = req.currentUser.id;
  const { popup_offer_id } = req.body;

  if (!popup_offer_id) {
    return ErrorResponse(res, 400, { message: 'Popup offer ID is required' });
  }

  const popupOfferExists = await PopupOffer.findOne({
    _id: popup_offer_id,
    status: true,
    isDeleted: false
  });
  
  if (!popupOfferExists) {
    return ErrorResponse(res, 404, { message: 'Popup offer not found' });
  }

  const readRecord = await PopupOfferRead.findOneAndUpdate(
    { 
      sales_id: sales_id, 
      popup_offer_id: popup_offer_id 
    },
    { 
      isRead: true,
      read_at: new Date()
    },
    { 
      upsert: true, 
      new: true 
    }
  );

  return SuccessResponse(res, { 
    message: 'Popup offer marked as read successfully', 
    data: readRecord
  }, 200);
});