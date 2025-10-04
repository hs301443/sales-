import mongoose, { Schema, model, Document } from 'mongoose';

const citySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
   isDeleted: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('City', citySchema); 