import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      unique: true,
      sparse: true, // Allows null during migration
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Optional during migration period - Firebase stores passwords
      minilength: 6,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast Firebase UID lookups
userSchema.index({ firebaseUID: 1 });

const User = mongoose.model("User", userSchema);

export default User;
