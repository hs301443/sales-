import { Router } from "express";
import AuthRoute from "./auth.js";

const route = Router();
route.use("/auth", AuthRoute);

export default route;