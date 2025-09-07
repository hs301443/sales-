import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
  },
  description: {
    type: String
  },
  start_date: {
    type: Date,
    required: [true, "Start Date is required"],
  },
  end_date: {
    type: Date,
    validate: {
      validator: function(endDate) {
        return endDate > this.start_date;
      },
      message: "End date must be after start date"
    }
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'value'],
    required: true
  },
  discount_amount: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        if (this.discount_type === 'percentage') {
          return value <= 100;
        }
        return true;
      },
      message: "Percentage discount cannot exceed 100%"
    }
  },
  subscription_details: {
    type: String,
    trim: true
  },
  setup_phase: {
    type: String,
    trim: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model('Offer', offerSchema);