import mongoose from "mongoose";
import { KitchenDasboardModal } from "../modals/KitchenDashboardModal.js";
import { KitchenModal } from "../modals/kitchenModal.js";
import { mealModal } from "../modals/MealModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";

const registerKitchen = async (req, res) => {

  const {
    kitchenName,
    mealPerPrice,
    kitchenPhoto,
    foodType,
    mealTime,
    aboutKitchen,
    // owner details
    ownerName,
    address,
    pinCode,
    landMark,
  } = req.body;

  if (!kitchenName) return errorRes(res, 404, "please enter kitchen name");
  if (!mealPerPrice) return errorRes(res, 404, "please enter meal per price");
  if (foodType.length == 0)
    return errorRes(res, 404, "please select food type");
  if (!mealTime) return errorRes(res, 404, "please enter meal time");
  if (!aboutKitchen)
    return errorRes(res, 404, "please add relevant details about kitchen");
  if (!ownerName) return errorRes(res, 404, "please enter owner name");
  if (!address) return errorRes(res, 404, "please enter address");
  if (!landMark) return errorRes(res, 404, "please enter landmark");
  if (!pinCode) return errorRes(res, 404, "please enter pincode");
  const user = req.user;
  if (user) {
    if (user.role == "buyer")
      return errorRes(res, 400, "please login as a seller");
    const createKitchen = await KitchenModal.create({
      kitchenName,
      mealPerPrice,
      // kitchenPhoto,
      foodType,
      mealTime,
      aboutKitchen,
      ownerName,
      address,
      pinCode,
      landMark,
    })(
      (user.address = address),
      (user.pinCode = pinCode),
      (user.landMark = landMark),
      (user.userName = ownerName),
      (user.verify = true),
    );
    const createKitchenDashboard = await KitchenDasboardModal.create({
      kitchenId: createKitchen._id,
      lastUpdate: new Date(),
    });

    await user.save();

    return successReSend(
      res,
      201,
      "Kitchen register successfully",
      createKitchen,
    );
  } else {
    errorRes(res, 404, "user not found!");
  }
};

const addMeal = async (req, res) => {
  const { kitchenId, mealName, price, mealDay, mealtype, mealTime } = req.body;
  if (!kitchenId) return errorRes(res, 404, "Please pass kitchenId");
  if ((!mealName, !price, !mealDay, !mealtype, !mealTime))
    return errorRes(res, 404, "Please fill all the details");

  const findKitchenMeal = await mealModal.findOne({ kitchenId: kitchenId });

  if (findKitchenMeal) {
    const isAlreadyMealDayExist = findKitchenMeal.meal.some(
      (item) => item.mealDay.toUpperCase() === mealDay.toUpperCase(),
    );

    if (isAlreadyMealDayExist) {
      return errorRes(
        res,
        409,
        `Meal for ${mealDay} already exists. If you want to update the meal, please use the edit option.`,
      );
    }

    findKitchenMeal.meal.push({
      mealName,
      price,
      mealDay,
      mealtype,
      mealTime,
    });
    await findKitchenMeal.save();
    return successRes(res, 200, "Meal added successfully", findKitchenMeal);
  }
  const meal = await mealModal.create({
    kitchenId,
    meal: [
      {
        mealName,
        price,
        mealDay,
        mealtype,
        mealTime,
      },
    ],
  });
  const kitchen = await KitchenModal.findById({ _id: kitchenId });
  kitchen.mealId = meal._id;
  kitchen.save();

  return successRes(res, 201, "Meal created successfully", meal);
};

const getKitchenDashboard = async (req, res) => {
  const { kitchenId } = req.query;
  if (!kitchenId) return errorRes(res, 404, "Please pass kitchenId");
  if (!mongoose.Types.ObjectId.isValid(kitchenId))
    return errorRes(res, 400, "Please pass a valid kitchenId");

  const iskitchenDashboardDataExists = await KitchenDasboardModal.findOne({
    kitchenId,
  });
  if (!iskitchenDashboardDataExists)
    return errorRes(res, 404, "kitchen not found..! try after sometime");
  successReSend(
    res,
    200,
    "Successfully Kitchen found",
    iskitchenDashboardDataExists,
  );
};
const getMealList = async (req, res) => {
  const { kitchenId } = req.query;
  const menuList = await mealModal.findOne({ kitchenId });
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const todayIndex = days.indexOf(today);
  const sortedDays = [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
  const sortedMenu = [...menuList.meal].sort(
    (a, b) => sortedDays.indexOf(a.mealDay) - sortedDays.indexOf(b.mealDay),
  );
  return successReSend(res, 200, "Meal data fetched successfully", sortedMenu);
};

export { registerKitchen, addMeal, getKitchenDashboard, getMealList };
