import express from 'express';
import { createSales, getAllSales, getSalesById, updateSales, deleteSales } from '../../controllers/admin/salesController.js';
import { validate } from '../../middlewares/validation.js';
import { createSalesSchema, updateSalesSchema } from '../../validation/admin/salesValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllSales)
    .post(validate(createSalesSchema), createSales);

router.route('/:id')
    .get(getSalesById)
    .put(validate(updateSalesSchema), updateSales)
    .delete(deleteSales);

export default router;