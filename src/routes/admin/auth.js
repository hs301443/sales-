import { Router } from 'express';
import { validate } from '../../middlewares/validation.js';
import { loginSchema } from '../../validation/user/auth.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const authRouter = Router();

authRouter.post('/login', validate(loginSchema),catchAsync( ));

// Export the authRouter to be used in the main app
export default authRouter;