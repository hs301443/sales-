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
  }
}, { timestamps: true });

export default mongoose.model('PaymentMethod', PaymentMethodSchema);
