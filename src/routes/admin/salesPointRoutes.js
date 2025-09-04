import express from 'express';
import { approveSale } from '../../controllers/admin/salesPointController.js';
import { validate } from '../../middlewares/validation.js';
import { approveSaleSchema } from '../../validation/admin/salesPointValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/:id')
  .put(validate(approveSaleSchema), approveSale);

export default router;