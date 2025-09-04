import mongoose from 'mongoose'; 

const SalesPointSchema = new mongoose.Schema({
  point: {
      type: Number, 
      required: [true, "Point is required"],
    },
   month: {
      type: Number,
      required: [true, "Month is required"],
      min: 1,
      max:12
    },
   year: {
      type: Number,
      required: [true, "Year is required"], 
    }, 
    sales_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  created_at: {
    type: Date,
    default: Date.now
  }
}); 

export default mongoose.model('SalesPoint', SalesPointSchema);