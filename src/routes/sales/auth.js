import { Router } from 'express';
//import {  login} from '../../controller/users/auth.js';
import { validate } from '../../middlewares/validation.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { loginSchema } from '../../validation/user/auth.js';
const route = Router()

route.post("/login", validate(loginSchema), catchAsync());


export default route;
