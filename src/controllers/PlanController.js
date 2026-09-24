import { KitchenModal } from "../modals/kitchenModal.js";
import { userModal } from "../modals/usersModal.js";
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

    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();
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
          plan: "Today",
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
    };
    successReSend(res, 200, "Plan details fetch successfully", result);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
};

export { getPlanDetails };
