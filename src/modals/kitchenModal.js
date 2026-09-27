import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema({
  kitchenName: {
    type: String,
    trim: true,
    require: true,
  },
  kitchenDashboardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KitchenDashBoard",
    default: null,
  },
  kitchenPhoto: {
    public_id: String,
    url: String,
  },
  mealId: {
    type: String,
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
    timestamps: true,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  isSubscriptionActive: {
    type: Boolean,
    default: null,
  },
  SubscriptionPlan: {
    type: String,
    default: null,
  },
  pricePerMeal: {
    type: Number,
  },
  foodType: [
    {
      _id: false,
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },
  ],
  mealTime: {
    type: String,
  },
  aboutKitchen: {
    type: String,
  },
  weeklyMealId: {
    type: String,
    default: null,
  },
});

export const KitchenModal = mongoose.model("kitchen", kitchenSchema);
