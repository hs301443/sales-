import mongoose from 'mongoose';

 const SorceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true })


export const SorceModel=model("Sorce",SorceSchema)