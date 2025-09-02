import mongoose from 'mongoose';

 const TargetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  point:{
    type: Number,
    required:true,
    default:0}
  
}, { timestamps: true })


export const TargetModel=model("Target",TargetSchema)