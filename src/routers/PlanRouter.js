import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getPlanDetails, planChoose } from "../controllers/PlanController.js";

const PlanRouter = express.Router();

PlanRouter.route("/getPlanDetails").get(getPlanDetails);
PlanRouter.route("/planChoose").post(isAuthenticated, planChoose);

export default PlanRouter;
