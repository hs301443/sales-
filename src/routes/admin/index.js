import { Router } from "express";
import authRouter from "./auth.js";
import userRouter from "./userRoutes.js";
import targetRouter from "./targetRoutes.js";
import sourceRouter from "./sourceRoutes.js";
import activityRouter from "./activityRoutes.js";
import paymentMethodRouter from "./paymentMethodRoutes.js";
import productRouter from "./productRoutes.js"
import offerRouter from "./offerRoutes.js";
import salesPointRouter from "./salesPointRoutes.js";
import leaderRouter from "./leaderRoutes.js";
import salesRouter from "./salesRoutes.js";
import leadRouter from "./leadRoutes.js";
import paymentRouter from "./paymentRoutes.js";
import salesManagementRoutes from "./salesManagementRoutes.js";
import commissionRoutes from "./commissionRoutes.js";
import locationRoutes from "./locationRoutes.js";
import popupOfferRoutes from "./popupOfferRoutes.js";
import homeRoutes from "./homeRoutes.js";

export const route = Router();

route.use("/auth", authRouter);
route.use("/users", userRouter);
route.use("/targets", targetRouter);
route.use("/sources", sourceRouter);
route.use("/activities", activityRouter);
route.use("/payment-methods", paymentMethodRouter);
route.use("/products", productRouter);
route.use("/offers", offerRouter);
route.use("/approve-sale", salesPointRouter);
route.use("/leaders", leaderRouter);
route.use("/sales", salesRouter);
route.use("/leads", leadRouter);
route.use("/payments", paymentRouter);
route.use("/sales-management", salesManagementRoutes);
route.use("/commissions", commissionRoutes);
route.use("/locations", locationRoutes);
route.use("/popup-offers", popupOfferRoutes);
route.use("/home", homeRoutes);

export default route;