import mongoose from "mongoose";

const HelpSupportSchema = new mongoose.Schema({
  query: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt:{
    type:String,
    default:new Date
  }
});

export const HelpSupportModal = mongoose.model(
  "HelpSupport",
  HelpSupportSchema,
);
