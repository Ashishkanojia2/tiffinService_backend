import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRouter from "./routers/AuthRouter.js";
import KitchenRouter from "./routers/KitchenRouter.js";
import AppRouter from "./routers/AppRouter.js";
import PlanRouter from "./routers/PlanRouter.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/kitchen", KitchenRouter);
app.use("/api/v1/app", AppRouter);
app.use("/api/v1/plan", PlanRouter);
