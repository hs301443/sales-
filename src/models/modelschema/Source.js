import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
 name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
  status: {
    type: String,
    enum: ['Active', 'inactive']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model('Source', sourceSchema);