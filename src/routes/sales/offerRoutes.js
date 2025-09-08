import express from 'express';
import { viewOffer } from '../../controllers/Sales/OfferController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();
 
router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

router.route('/offer').get(viewOffer);

export default router;