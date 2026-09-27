import express from "express";
import {
  helpAndSupport,
  getOrderHistoryList,
} from "../controllers/AppController.js";
import { isAuthenticated } from "../middleware/auth.js";

const AppRouter = express.Router();

AppRouter.route("/helpAndSupport").post(isAuthenticated, helpAndSupport);
AppRouter.route("/getOrderHistoryList").get(
  isAuthenticated,
  getOrderHistoryList,
);

export default AppRouter;
