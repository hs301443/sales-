import mongoose, { Schema, model, Document } from 'mongoose';

const countrySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    default: 'Egypt'
  },
   isDeleted: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('Country', countrySchema);