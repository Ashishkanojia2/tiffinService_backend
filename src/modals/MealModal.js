import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  kitchenId: {
    type: String,
  },
  meal: [
    {
    //   _id: false,
      mealPhoto: {
        public_id: String,
        url: String,
      },
      mealName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      mealDay: {
        type: String,
        require: true,
      },
      mealtype: {
        type: String,
        required: true,
      },
      mealTime: {
        type: String,
        required: true,
      },
    },
  ],
});

export const mealModal = mongoose.model("Meal", mealSchema);
