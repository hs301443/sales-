import express from 'express';
import { login } from '../../controllers/auth/authController.js';
import { validate } from '../../middlewares/validation.js';
import { loginSchema } from '../../validation/user/auth.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);

export default router;