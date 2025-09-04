import express from 'express';
import { viewHome } from '../../controllers/Leader/HomeController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.LEADER));

router.route('/')
    .get(viewHome);

export default router;