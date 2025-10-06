import mongoose from 'mongoose';

const popupOfferReadSchema = new mongoose.Schema({
  sales_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Sales ID is required"],
  },
  popup_offer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PopupOffer',
    required: [true, "Popup Offer ID is required"],
  },
  isRead: {
    type: Boolean,
    default: false
  },
  read_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});


export const PopupOfferRead = mongoose.model('PopupOfferRead', popupOfferReadSchema);