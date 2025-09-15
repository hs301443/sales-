import { Router } from "express";

import adminRouter from './admin/index.js';
import authRouter from './auth/authRoutes.js';
import homeRouter from './leader/homeRoutes.js';
import leadRouter from './leader/leadRoutes.js';
import salesRouter from './sales/leadRoutes.js'
import offerRouter from './sales/offerRoutes.js';
import productRouter from './sales/productRoutes.js';
import paymentRouter from './sales/paymentRoutes.js';
import ScheduledContactRoutes from './sales/ScheduleContactRoutes.js';
import commissionRoutes from './sales/commissionRoutes.js';

const route = Router();

route.use('/auth', authRouter);

route.use('/admin', adminRouter);

route.use('/leader', homeRouter);

route.use('/leader/leads', leadRouter);

route.use('/sales/leads', salesRouter);

route.use('/sales/offers', offerRouter);

route.use('/sales/products', productRouter);

route.use('/sales/payments', paymentRouter);

route.use('/sales', ScheduledContactRoutes);

route.use('/sales', commissionRoutes);




export default route;