import mongoose from 'mongoose';

 const ActivitySchema = new mongoose.Schema({
  name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
  status: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true })


export default mongoose.model('Activity', ActivitySchema);