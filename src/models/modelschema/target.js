import mongoose from 'mongoose';

 const TargetSchema = new mongoose.Schema({
  name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
  point:{
    type: Number,
    required: [true, "Point is required"],
    min: [0, 'Point must be a positive number'],
    default:0
  },
   status: {
    type: String,
    enum: ['Active', 'inactive']
  },
  
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

  export default mongoose.model('Target', TargetSchema);