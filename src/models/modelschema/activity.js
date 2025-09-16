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
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })


export default mongoose.model('Activity', ActivitySchema);