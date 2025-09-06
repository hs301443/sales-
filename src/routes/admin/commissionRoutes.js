import express from 'express';
import { 
  createCommission, 
  getAllCommissions, 
  getCommissionById, 
  updateCommission, 
  deleteCommission,
  getCommissionByPoints
} from '../../controllers/admin/commissionController.js';
import { validate } from '../../middlewares/validation.js';
import { createCommissionSchema, updateCommissionSchema } from '../../validation/admin/commissionValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllCommissions)
    .post(validate(createCommissionSchema), createCommission);

router.route('/:id')
    .get(getCommissionById)
    .put(validate(updateCommissionSchema), updateCommission)
    .delete(deleteCommission);

router.route('/points/:points')
    .get(getCommissionByPoints);

export default router;