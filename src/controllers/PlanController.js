import { KitchenDasboardModal } from "../modals/KitchenDashboardModal.js";
import { KitchenModal } from "../modals/kitchenModal.js";
import { mealPlanModal } from "../modals/MealPlanModal.js";
import { userModal } from "../modals/usersModal.js";
import DaysCalculator from "../utils/DaysCalculator.js";
import { errorRes, successReSend } from "../utils/globalResponseHandler.js";

const getPlanDetails = async (req, res) => {
  try {
    const { kitchenId } = req.query;
    const getKitchenDetails = await KitchenModal.findById({ _id: kitchenId });
    const getKitchenOwnerDetails = await userModal.findById({
      _id: getKitchenDetails.userId,
    });
    const basePlanCharge = getKitchenDetails?.pricePerMeal ?? 0;
    const weeklyOff = process.env.WEEKLY_OFF;
    const monthlyOff = process.env.MONTHLY_OFF;
    const daysInMonth = DaysCalculator();

    const chargesCalculator = (plan) => {
      try {
        if (!plan) return basePlanCharge;

        if (plan === "OneDay") {
          return basePlanCharge;
        } else if (plan === "weeklyOff") {
          return (basePlanCharge - (basePlanCharge * weeklyOff) / 100) * 7;
        } else if (plan === "monthlyOff") {
          return (
            (basePlanCharge - (basePlanCharge * monthlyOff) / 100) * daysInMonth
          );
        } else {
          return basePlanCharge;
        }
      } catch (error) {
        errorRes(res, 500, error.message);
      }
    };

    const result = {
      plans: [
        {
          plan: "OneDay",
          day: "1 Day",
          price: chargesCalculator("OneDay"),
        },
        {
          plan: "Weekly",
          day: "7 Days",
          price: chargesCalculator("weeklyOff"),
        },
        {
          plan: "Monthly",
          day: `${daysInMonth} Days`,
          price: chargesCalculator("monthlyOff"),
        },
      ],
      mealType: [
        {
          lable: "Lunch",
          time: "1:30 PM",
        },
        {
          lable: "Dinner",
          time: "8:00PM",
        },
        {
          lable: "Both",
          time: "1:30 PM - 8:00 PM",
        },
      ],
      deliveryCharge: process.env.DELIVERY_CHARGE ?? 6,
      deliveryType: [
        {
          title: "Home/PG delivery",
          lable: "Hot tiffin at your door",
        },
        {
          title: "Self pickup",
          lable: `${getKitchenOwnerDetails?.address ?? ""}, ${getKitchenOwnerDetails?.landMark ?? ""}`,
        },
      ],
      foodPerference: getKitchenDetails?.foodType ?? [],
      kitchenId: kitchenId,
    };
    successReSend(res, 200, "Plan details fetch successfully", result);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};
const planChoose = async (req, res) => {
  try {
    const {
      kitchenId,
      planType,
      mealType,
      foodPerference,
      deliveryMode,
      startingDate,
      note,
    } = req.body;
    const userId = req.user?._id;
    if (!userId) return errorRes(res, 404, "Please pass userId");
    if (!kitchenId) return errorRes(res, 404, "Please pass kitchenId");
    if (
      !kitchenId ||
      !planType ||
      !mealType ||
      !foodPerference ||
      !deliveryMode
      //   !startingDate
    )
      return errorRes(res, 404, "please select or fill required fields");
    const [user, kitchenData] = await Promise.all([
      userModal.findById(userId),
      KitchenModal.findById({ _id: kitchenId }),
    ]);
    (console.log("user", user), console.log("kitchenData", kitchenData));

    if (kitchenData) {
      var kitchenDashboard = await KitchenDasboardModal.findById({
        _id: kitchenData?.kitchenDashboardId,
      });
    } else {
      error.res(
        res,
        500,
        "Something wents wrong to sending request to your subscribed kitchen.",
      );
    }
    console.log("kitchenDashboard", kitchenDashboard);

    if (!user)
      return errorRes(res, 403, "User not found, please retry or login");
    if (user.role === "seller")
      return errorRes(
        res,
        400,
        "To purchase meal plan you should should be a byuer .So login as a buyer account ",
      );
    if (!kitchenDashboard)
      return errorRes(
        res,
        500,
        "KitchenDashboard not found..! Please try again",
      );

    const calculateEndingDate = (planType, startingDate) => {
      const start = new Date(startingDate);

      if (planType === "OneDay") return start;
      if (planType === "Weekly") {
        const endingDate = new Date(start);
        endingDate.setDate(endingDate.getDate() + 6);
        return endingDate;
      }

      if (planType === "Monthly") {
        const endingDate = new Date(start);
        endingDate.setMonth(endingDate.getMonth() + 1);
        endingDate.setDate(endingDate.getDate() - 1);
        return endingDate;
      }
      return null;
    };

    const startDate = startingDate ? new Date(startingDate) : new Date();
    const endingDate = calculateEndingDate(planType.plan, startDate);
    const selectedPlan = await mealPlanModal.create({
      kitchenId,
      userId,
      planType,
      mealType,
      deliveryMode,
      foodPerference,
      startingDate: startDate,
      endingDate,
      note: "Please deliver on Time",
      paymentId: "1234567890asdf",
      planStatus: "Kitchen not accepted yet..",
      KitchenStatus: "PENDING",
    });

    user.SubscriptionPlan.push(selectedPlan._id);
    user.orderHistory.push(selectedPlan._id);
    kitchenDashboard.isNewRequestArrived.push(selectedPlan._id);
    kitchenDashboard.activeSubscriber = kitchenDashboard.activeSubscriber + 1;
    kitchenDashboard.todayTiffin = kitchenDashboard.todayTiffin + 1;

    const result = {
      selectedPlan: selectedPlan._id,
      plan: planType ?? "",
      startOn: startingDate ?? "",
      deliveryMode: deliveryMode ?? "",
      amount: planType?.price ?? "",
    };
    if (selectedPlan) {
      return (
        await user.save(),
        await kitchenDashboard.save(),
        successReSend(res, 200, "Plan selected", result)
      );
    } else {
      errorRes(res, 400, "Something wents wrong");
    }
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export { getPlanDetails, planChoose };
