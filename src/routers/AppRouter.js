import express from "express";
import { helpAndSupport } from "../controllers/AppController.js";
import { isAuthenticated } from "../middleware/auth.js";

const AppRouter = express.Router();

AppRouter.route("/helpAndSupport").post( isAuthenticated ,helpAndSupport);

export default AppRouter;
