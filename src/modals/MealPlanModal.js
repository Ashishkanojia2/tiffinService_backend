import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "kitchen",
    // type:String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  mealType: {
    label: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
  },
  planType: {
    plan: {
      type: String,
      default: null,
    },
    day: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
  },
  deliveryMode: {
    type: String,
    default: null,
  },
  startingDate: {
    type: Date,
    default: Date.now,
  },
  endingDate: {
    type: Date,
    default: null,
  },
  note: {
    type: String,
    default: null,
  },
  paymentId: {
    type: String,
    default: null,
  },
  planStatus: {
    type: String,
    default: null,
    required: true,
  },
  KitchenStatus: {
    type: String,
    default: null,
    required: true,
  },
  foodPerference: {
    type: String,
    default: null,
    required: true,
  },

});

export const mealPlanModal = mongoose.model("mealPlan", mealPlanSchema);
