import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { register, addLocation } from "../controllers/AuthController.js";

const AuthRouter = express.Router();

AuthRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Welcome to User API" });
});
AuthRouter.route("/register").post(register);
AuthRouter.route("/addLocation").post( isAuthenticated ,addLocation);

export default AuthRouter;
