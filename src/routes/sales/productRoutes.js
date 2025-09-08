import express from 'express';
import { viewProduct } from '../../controllers/Sales/ProductController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

router.route('/product').get(viewProduct);

export default router;