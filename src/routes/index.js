import { Router } from "express";

import adminRouter from './admin/index.js';
import authRouter from './auth/authRoutes.js';

const route = Router();

route.use('/auth', authRouter);

route.use('/admin', adminRouter);


export default route;