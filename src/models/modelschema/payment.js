import mongoose from 'mongoose'; 

const PaymentSchema = new mongoose.Schema({
    lead_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    sales_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    offer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    payment_method_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod'
    },
   amount: {
      type: Number,
      required: [true, "amount is required"],
    }, 
    proof_image: {
    type: String,
    required: true,
  },
  payment_date: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('Payment', PaymentSchema);