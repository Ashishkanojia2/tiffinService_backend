import express from "express";
import {
  helpAndSupport,
  getOrderHistoryList,
  rating,
  getMyCurentSubscription,
  updateProfile,
  updateAddress,
} from "../controllers/AppController.js";
import { isAuthenticated } from "../middleware/auth.js";

const AppRouter = express.Router();

AppRouter.route("/helpAndSupport").post(isAuthenticated, helpAndSupport);
AppRouter.route("/rating").post(isAuthenticated, rating);
AppRouter.route("/getMyCurentSubscription").get(
  isAuthenticated,
  getMyCurentSubscription,
);
AppRouter.route("/updateProfile").put(isAuthenticated, updateProfile);
AppRouter.route("/updateAddress").put(isAuthenticated, updateAddress);
AppRouter.route("/getOrderHistoryList").get(
  isAuthenticated,
  getOrderHistoryList,
);

export default AppRouter;
