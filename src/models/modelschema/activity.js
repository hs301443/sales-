import mongoose from 'mongoose';

 const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, 
  status: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true })


export const ActivityModel=model("Activity",ActivitySchema)