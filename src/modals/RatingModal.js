import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
  rating: {
    type: Number,
    require: true,
    default: 0,
  },
  quickFeedback: {
    type: [String],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "kitchen",
    default: null,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: String,
    default: new Date(),
  },
});

export const RatingModal = mongoose.model("Rating", RatingSchema);
