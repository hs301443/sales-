import mongoose from 'mongoose';

const PaymentMethodSchema = new mongoose.Schema({
  name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
    status: {
    type: Boolean,
    default: true,
  },
  logo_url: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', PaymentMethodSchema);
