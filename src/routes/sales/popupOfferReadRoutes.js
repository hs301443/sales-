import express from 'express';
import { markPopupOfferAsRead } from '../../controllers/Sales/popupOfferRead.js'
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
import { verifyToken } from '../../middlewares/verifyToken.js';



const router = express.Router();

router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

router.post('/popup-offers/mark-read', markPopupOfferAsRead);

export default router;