import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
   email: {
      type: String,
      required: [true, "Email must be provided"],
      unique: [true, "Email must be unique"],
      trim: true,
      lowercase: true,
    },
  password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Too short password"],
    },
  role: {
    type: String,
    enum: ['Salesman', 'Sales Leader', 'Admin'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'inactive']
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Target'
  },
  leader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('User', userSchema);