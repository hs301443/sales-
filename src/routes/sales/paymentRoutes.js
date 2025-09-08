import express from 'express';
import { viewPayment, addPayment } from '../../controllers/Sales/PaymentController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();
 
router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

router.route('/payment')
      .post(addPayment)    
      .get(viewPayment)



export default router;