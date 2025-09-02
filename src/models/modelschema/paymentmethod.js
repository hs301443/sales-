import mongoose from 'mongoose';

const PaymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
    status: {
    type: Boolean,
    default: true,
  },
  logo: {
    type: String,
    required: true,
  }
}, { timestamps: true });
