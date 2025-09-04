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
  price_month: {
    type: Number,
    min: 0
  },
  price_quarter: {
    type: Number,
    min: 0
  },
  price_year: {
    type: Number,
    min: 0
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
  }
});

export default mongoose.model('Product', productSchema);