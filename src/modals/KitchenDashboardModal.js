import mongoose from "mongoose";

// const kitchenDashboardSchema = new mongoose.Schema({
//   kitchenId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Kitchen",
//     required: true,
//   },
//   todayTiffin: {
//     type: String,
//   },
//   activeSubscriber: {
//     type: Number,
//   },
//   thisMonthRevenue: {
//     type: String,
//   },
//   kitchenRating: {
//     id: {
//       type: String,
//     },
//     rating: {
//       type: String,
//       default: 0,
//     },
//   },
//   todayMenu: {
//     type: String,
//   },
//   isNewRequestArrived: {
//     type: Boolean,
//   },
//   newRequest: {
//     type: String,
//   },
//   totalTiffinDelivered: {
//     type: String,
//   },
//   lastUpdate: {
//     type: Date,
//   },
// });

const kitchenDashboardSchema = new mongoose.Schema(
  {
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

    isNewRequestArrived: {
      type: Boolean,
      default: false,
    },

    newRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TiffinRequest",
      default: null,
    },

    totalTiffinDelivered: {
      type: Number,
      default: 0,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },
  },
//   { timestamps: true },
);
export const KitchenDasboardModal = mongoose.model(
  "KitchenDashBoard",
  kitchenDashboardSchema,
);
