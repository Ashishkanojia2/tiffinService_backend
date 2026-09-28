import { HelpSupportModal } from "../modals/HelpSupportModal.js";
import { KitchenModal } from "../modals/kitchenModal.js";
import { mealPlanModal } from "../modals/MealPlanModal.js";
import { RatingModal } from "../modals/RatingModal.js";
import { userModal } from "../modals/usersModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
const defaultImage = {
  public_id: "1234567890asdfghjk",
  url: "https://drive.google.com/...",
};

const helpAndSupport = async (req, res) => {
  const userId = req?.user._id;
  const { query } = req?.body;

  if (!userId) return errorRes(res, 401, "Please login first");
  if (!query?.trim()) return errorRes(res, 400, "Please enter your query");

  const user = await userModal.findById(userId);
  if (!user) return errorRes(res, 401, "Please login first");

  const supportData = await HelpSupportModal.create({
    query,
    userId: userId,
  });
  user.query.push(supportData._id);
  user.save();
  successRes(res, 201, "Query submit successfully");
};
const getOrderHistoryList = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return errorRes(res, 403, "Please login");
    const userData = await userModal.findById({ _id: userId });
    if (!userData) return errorRes(res, 404, "User not found..!");

    const result = await Promise.all(
      (userData.SubscriptionPlan || []).map(async (item) => {
        const mealPlan = await mealPlanModal.findById(item);
        console.log("mealPlan", mealPlan);
        if (!mealPlan) return null;
        const kitchenDetails = await KitchenModal.findById(mealPlan.kitchenId);
        console.log("kitchenDetails", kitchenDetails);

        if (!kitchenDetails) return null;
        return {
          kitchenId: mealPlan?.kitchenId ?? "",
          kitchenName: kitchenDetails.kitchenName,
          planType: mealPlan.planType,
          startingDate: mealPlan.startingDate,
          amount: mealPlan.planType?.price,
          endingDate: mealPlan.endingDate,
        };
      }),
    );

    console.log("RESULT ", result);

    return successReSend(
      res,
      200,
      "Order history fetched successfully",
      result.filter(Boolean),
    );
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const rating = async (req, res) => {
  try {
    const user = req.user;
    const { rating, message, quickFeedback, kitchenId } = req.body;
    if (!rating) return errorRes(res, 400, "Please give rating");
    if (!kitchenId) return errorRes(res, 404, "kitche Id missing ");
    const kitchen = await KitchenModal.findById({ _id: kitchenId });
    const kitchenRating = await RatingModal.create({
      rating,
      message: message ?? "",
      quickFeedback,
      kitchenId,
      userId: user.Id,
    });
    kitchen?.rating.push(kitchenRating._id);
    user?.rating.push(kitchenRating._id);
    if (kitchenRating) {
      (user.save(), kitchen.save());
      successReSend(res, 201, "Thankyou for your support.");
    }
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

const calculateNoOfMealPending = ({ plan, mealType }) => {
  const isBoth = mealType?.lable === "both";

  if (plan?.plan === "weekly") {
    return isBoth ? 14 : 7;
  }

  if (plan?.plan === "monthly") {
    const totalDaysInThisMonth = DaysCalculator();
    return isBoth ? totalDaysInThisMonth * 2 : totalDaysInThisMonth;
  }

  return isBoth ? 2 : 1;
};
const getMyCurentSubscription = async (req, res) => {
  try {
    const user = req.user;
    const getmyAllrecords = await Promise.all(
      user.SubscriptionPlan.map(async (item) => {
        const mealPlan = await mealPlanModal.findById(item);

        const kitchen = await KitchenModal.findById(mealPlan.kitchenId);
        // if (!kitchen) return error(res, 404, "kitchen not found");
        console.log("()()()()()()()mealPlan)()(())()()()", mealPlan);
        console.log("()()()()()()()kitchen)()(())()()()", kitchen);
        const result = {
          foodPerference: mealPlan.foodPerference,
          todayStatus: "Resume",
          startingDate: mealPlan?.startingDate,
          endingDate: mealPlan?.endingDate,
          remaningDays: calculateNoOfMealPending({
            plan: mealPlan?.planType ?? "",
            mealType: mealPlan?.mealType ?? "",
          }),
          kitchenName: kitchen?.kitchenName ?? "",
          image: defaultImage,
        };
        return result;
      }),
    );

    successReSend(res, 200, "Plan fetch successfully", getmyAllrecords);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const updateProfile = (req, res) => {
  try {
    const user = req.user;
    const { userName } = req.body;
    if (!userName) return errorRes(res, 404, "name");
    if (user.userName === userName)
      return errorRes(res, 400, "New name should be different to old one");

    user.userName = userName;
    user.save();
    successRes(res, 201, "Name update successfully");
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

const updateAddress = (req, res) => {
  try {
    const user = req.user;
    const { address, landMark, pinCode } = req.body;
    if (!address) return errorRes(res, 404, "Please provide address");
    if (!landMark) return errorRes(res, 404, "Please provide landmark");
    if (!pinCode) return errorRes(res, 404, "Please provide pinCode");

    if (user.address === address)
      return errorRes(res, 400, "New address should be different to old one");
    user.address = address;
    user.pinCode = pinCode;
    user.landMark = landMark;
    user.save();
    successRes(res, 201, " Address update successfully");
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
export {
  helpAndSupport,
  getOrderHistoryList,
  rating,
  getMyCurentSubscription,
  updateProfile,
  updateAddress,
};
