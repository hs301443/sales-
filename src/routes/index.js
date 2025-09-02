import { Router } from "express";
import userRouter from './user/index.js';
import adminRouter from './admin/index.js';
const route = Router();

route.use('/admin', adminRouter);

route.use('/user', userRouter);

export default route;