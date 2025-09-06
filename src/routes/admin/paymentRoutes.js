import express from 'express';
import { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment } from '../../controllers/admin/paymentController.js';
import { validate } from '../../middlewares/validation.js';
import { createPaymentSchema, updatePaymentSchema } from '../../validation/admin/paymentValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllPayments)
    .post(validate(createPaymentSchema), createPayment);

router.route('/:id')
    .get(getPaymentById)
    .put(validate(updatePaymentSchema), updatePayment)
    .delete(deletePayment);

export default router;