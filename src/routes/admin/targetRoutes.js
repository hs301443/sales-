import express from 'express';
import { validate } from '../../middlewares/validation.js';
import { createTargetSchema, updateTargetSchema } from '../../validation/admin/targetValidator.js';
import { createTarget, getAllTargets, getTargetById, updateTarget, deleteTarget} from '../../controllers/admin/targetController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
  .get(getAllTargets)
  .post(validate(createTargetSchema),createTarget);

router.route('/:id')
  .get(getTargetById)
  .put(validate(updateTargetSchema), updateTarget)
  .delete(deleteTarget);

  export default router;