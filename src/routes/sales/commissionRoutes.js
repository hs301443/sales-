import express from 'express';
import { viewHome } from '../../controllers/Sales/CommisionController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();
 
router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

router.route('/commission').get(viewHome);

export default router;