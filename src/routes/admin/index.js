import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./userRoutes.js";
import targetRouter from "./targetRoutes.js";

export const route = Router();

route.use("/auth", authRouter);
route.use("/users", userRouter);
route.use("/targets", targetRouter);


export default route;