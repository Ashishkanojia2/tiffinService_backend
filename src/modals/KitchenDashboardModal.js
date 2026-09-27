import mongoose from "mongoose";
const kitchenDashboardSchema = new mongoose.Schema({
  kitchenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kitchen",
    required: true,
  },

  todayTiffin: {
    type: Number,
    default: 0,
  },

  activeSubscriber: {
    type: Number,
    default: 0,
  },

  thisMonthRevenue: {
    type: Number,
    default: 0,
  },

  kitchenRating: {
    type: Number,
    default: null,
  },

  todayMenu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meal",
    default: null,
  },
  isNewRequestArrived: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mealPlan",
      default: [],
    },
  ],

  totalTiffinDelivered: {
    type: Number,
    default: 0,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});
export const KitchenDasboardModal = mongoose.model(
  "KitchenDashBoard",
  kitchenDashboardSchema,
);
