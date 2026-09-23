import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { registerKitchen, addMeal ,getKitchenDashboard ,getMealList} from "../controllers/KithcenController.js";

const KitchenRouter = express.Router();

KitchenRouter.route("/registerKitchen").post(isAuthenticated, registerKitchen);
KitchenRouter.route("/addMeal").post(isAuthenticated, addMeal);
KitchenRouter.route("/getKitchenDashboard").get(isAuthenticated, getKitchenDashboard);
KitchenRouter.route("/getMealList").get(isAuthenticated, getMealList);

export default KitchenRouter;
