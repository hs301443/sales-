import { Router } from "express";

import adminRouter from './admin/index.js';
import authRouter from './auth/authRoutes.js';
import homeRouter from './leader/homeRoutes.js';
import leadRouter from './leader/leadRoutes.js';

const route = Router();

route.use('/auth', authRouter);

route.use('/admin', adminRouter);

route.use('/leader', homeRouter);

route.use('/leader/leads', leadRouter);


export default route;