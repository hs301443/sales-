import express from 'express';
import { createPaymentMethod, getAllPaymentMethods, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod} from '../../controllers/admin/paymentMethodController.js';
import { validate } from '../../middlewares/validation.js';
import { paymentMethodSchema, updatePaymentMethodSchema } from '../../validation/admin/paymentMethodValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllPaymentMethods)
    .post(validate(paymentMethodSchema), createPaymentMethod);

router.route('/:id')
    .get(getPaymentMethodById)
    .put(validate(updatePaymentMethodSchema), updatePaymentMethod)
    .delete(deletePaymentMethod);
export default router;