import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./userRoutes.js";
import targetRouter from "./targetRoutes.js";
import sourceRouter from "./sourceRoutes.js";
import activityRouter from "./activityRoutes.js";
import paymentMethodRouter from "./paymentMethodRoutes.js";
import productRouter from "./productRoutes.js"
import offerRouter from "./offerRoutes.js";

export const route = Router();

route.use("/auth", authRouter);
route.use("/users", userRouter);
route.use("/targets", targetRouter);
route.use("/sources", sourceRouter);
route.use("/activities", activityRouter);
route.use("/payment-methods", paymentMethodRouter);
route.use("/products", productRouter);
route.use("/offers", offerRouter);

export default route;