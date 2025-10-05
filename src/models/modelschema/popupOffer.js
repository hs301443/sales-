import mongoose from 'mongoose';

const popupOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Title is required"],
  },
  image: {
    type: String, 
    required: [true, "Image is required"],
  },
  link: {
    type: String, 
    required: [true, "Link is required"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});


export default mongoose.model('PopupOffer', popupOfferSchema);