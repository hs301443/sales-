import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./userRoutes.js";
import targetRouter from "./targetRoutes.js";
import sourceRouter from "./sourceRoutes.js";

export const route = Router();

route.use("/auth", authRouter);
route.use("/users", userRouter);
route.use("/targets", targetRouter);
route.use("/sources", sourceRouter);


export default route;