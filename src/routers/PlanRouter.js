import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getPlanDetails } from "../controllers/PlanController.js";

const PlanRouter = express.Router();

PlanRouter.route("/getPlanDetails").get(getPlanDetails);

export default PlanRouter;
