import { HelpSupportModal } from "../modals/HelpSupportModal.js";
import { KitchenModal } from "../modals/kitchenModal.js";
import { mealPlanModal } from "../modals/MealPlanModal.js";
import { userModal } from "../modals/usersModal.js";
import {
  errorRes,
  successRes,
  successReSend,
} from "../utils/globalResponseHandler.js";
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

export { helpAndSupport, getOrderHistoryList };
