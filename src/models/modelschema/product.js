import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  description: {
    type: String
  },
  subscription_type: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Half year', 'Yearly'],
    required: [true, "Subscription type is required"]
  },
  price: {
    type: Number,
    min: 0,
    required: [true, "Price is required"]
  },
  setup_fees: {
    type: Number,
    min: 0,
    required: [true, "Setup fees is required"],
    default: 0,
  },
  status: {
    type: Boolean,
    default: true 
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

export default mongoose.models.Product || mongoose.model('Product', productSchema);