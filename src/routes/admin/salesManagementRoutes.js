import express from 'express';
import { 
  createSale, 
  getAllSales, 
  getSaleById, 
  updateSale, 
  deleteSale,
  getSalesByStatus,
  getSalesBySalesman
} from '../../controllers/admin/salesManagementController.js';
import { validate } from '../../middlewares/validation.js';
import { createSaleSchema, updateSaleSchema } from '../../validation/admin/salesManagementValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllSales)
    .post(validate(createSaleSchema), createSale);

router.route('/:id')
    .get(getSaleById)
    .put(validate(updateSaleSchema), updateSale)
    .delete(deleteSale);

router.route('/status/:status')
    .get(getSalesByStatus);

router.route('/salesman/:sales_id')
    .get(getSalesBySalesman);

export default router;