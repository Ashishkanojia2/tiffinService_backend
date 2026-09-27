import mongoose from "mongoose";
import { KitchenDasboardModal } from "../modals/KitchenDashboardModal.js";
import { KitchenModal } from "../modals/kitchenModal.js";
import { mealModal } from "../modals/MealModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
import { userModal } from "../modals/usersModal.js";

const arrangeMealList = async (menuList) => {
  console.log("1234567890", menuList);

  try {
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
    const sortedDays = [
      ...days.slice(todayIndex),
      ...days.slice(0, todayIndex),
    ];
    const sortedMenu = [...menuList.meal].sort(
      (a, b) => sortedDays.indexOf(a.mealDay) - sortedDays.indexOf(b.mealDay),
    );
    return sortedMenu;
  } catch (error) {
    console.log("Error:", error.message);
  }
};
const registerKitchen = async (req, res) => {
  try {
    const {
      kitchenName,
      pricePerMeal,
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
    if (pricePerMeal == null) {
      return errorRes(res, 400, "please enter meal price");
    }
    if (!foodType || foodType.length === 0) {
      return errorRes(res, 400, "please select food type");
    }
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
      if (user.kitchenId != null)
        return errorRes(res, 409, "Kitchen already registered in this number.");
      const createKitchen = await KitchenModal.create({
        kitchenName,
        pricePerMeal,
        // kitchenPhoto,
        foodType,
        mealTime,
        aboutKitchen,
        ownerName,
        address,
        pinCode,
        landMark,
        userId: user._id,
      });
      user.address = address;
      user.pinCode = pinCode;
      user.landMark = landMark;
      user.userName = ownerName;
      user.kitchenId = createKitchen._id;
      user.verify = true;

      const kitchenDashboard = await KitchenDasboardModal.create({
        kitchenId: createKitchen._id,
        lastUpdate: new Date(),
      });
      createKitchen.kitchenDashboardId = kitchenDashboard._id;
      await createKitchen.save();
      await user.save();

      if (createKitchen && kitchenDashboard) {
        return successReSend(
          res,
          201,
          "Kitchen register successfully",
          createKitchen,
        );
      } else {
        errorRes(
          res,
          400,
          "Something wents wrong in kitchen or kitchen dashboard",
        );
      }
    } else {
      errorRes(res, 404, "user not found!");
    }
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const addMeal = async (req, res) => {
  try {
    const { kitchenId, mealName, price, mealDay, mealtype, mealTime } =
      req.body;
    if (!kitchenId) return errorRes(res, 404, "Please pass kitchenId");
    if ((!mealName, !price, !mealDay, !mealtype, !mealTime))
      return errorRes(res, 404, "Please fill all the details");

    const kitchenData = await KitchenModal.findOne({ _id: kitchenId });
    console.log("kitchenData", kitchenData);

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
      kitchenData.weeklyMealId = findKitchenMeal._id;
      await kitchenData.save();
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
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const getKitchenDashboard = async (req, res) => {
  try {
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
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const getMealList = async (req, res) => {
  try {
    const { kitchenId } = req.query;
    const menuList = await mealModal.findOne({ kitchenId });
    if (!menuList)
      return errorRes(
        res,
        404,
        "meal not found.. pleae pass correct kitchenId or create meal first",
      );
    const sortedMenu = await arrangeMealList(menuList);
    if (sortedMenu) {
      return successReSend(
        res,
        200,
        "Meal data fetched successfully",
        sortedMenu,
      );
    } else {
      errorRes(res, 404, "Sorted list not found");
    }
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const getKitchenList = async (req, res) => {
  try {
    //FILTER AND SEARCH PENDING
    const list = await KitchenModal.find();
    const final = await Promise.all(
      list.map(async (item) => {
        const menuList = await mealModal.findOne({ kitchenId: item._id });
        const user = await userModal.findOne({ _id: item.userId });
        const sortedMenu = await arrangeMealList(menuList);
        return {
          kitchenId: item._id,
          kitchenName: item.kitchenName,
          pricePerMeal: item.pricePerMeal,
          foodType: item.foodType,
          mealTime: item.mealTime,
          rating: list?.rating ?? "0.0",
          DeliveryType: "Self pickup",

          todayMenu: sortedMenu[0],
          address: user.address,
          landMark: user.landMark,
        };
      }),
    );
    successReSend(res, 200, "kitchen list fetch succesfully", final);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const getKitchenDetails = async (req, res) => {
  const { kitchenId } = req.query;

  try {
    const kitchenData = await KitchenModal.findOne({
      _id: kitchenId,
    });

    if (!kitchenData) {
      return errorRes(res, 404, "Kitchen not found");
    }

    console.log("kitchenData", kitchenData);

    const [mealData, userData] = await Promise.all([
      mealModal.findOne({
        kitchenId: kitchenId,
      }),

      userModal.findOne({
        _id: kitchenData.userId,
      }),
    ]);
    const result = {
      ...kitchenData.toObject(),
      ...userData?.toObject(),
      mealData,
    };

    console.log("RESULT", result);

    successReSend(res, 200, "Kitchen details fetched successfully", result);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export {
  registerKitchen,
  addMeal,
  getKitchenDashboard,
  getMealList,
  getKitchenList,
  getKitchenDetails,
};
