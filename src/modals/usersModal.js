import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  createdAt: {
    type: Date,
    timestamps: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  query: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HelpSupport",
      },
    ],
    default: [],
  },
  phone: {
    type: String,
  },
  landMark: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  address: {
    type: String,
  },
  isSubscriptionActive: {
    type: Boolean,
  },
  SubscriptionPlan: {
    type: String,
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer",
  },
});
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

export const userModal = mongoose.model("User", userSchema);
