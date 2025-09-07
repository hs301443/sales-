import { Router } from "express";

import adminRouter from './admin/index.js';
import authRouter from './auth/authRoutes.js';
import homeRouter from './leader/homeRoutes.js';
import leadRouter from './leader/leadRoutes.js';
import salesRouter from './sales/leadRoutes.js'

const route = Router();

route.use('/auth', authRouter);

route.use('/admin', adminRouter);

route.use('/leader', homeRouter);

route.use('/leader/leads', leadRouter);

route.use('/sales/leads', salesRouter);


export default route;