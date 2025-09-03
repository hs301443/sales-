import express from 'express';
import { createSource, getAllSources, getSourceById, updateSource, deleteSource} from '../../controllers/admin/sourceController.js';
import { validate } from '../../middlewares/validation.js';
import { createSourceSchema, updateSourceSchema } from '../../validation/admin/sourceValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllSources)
    .post(validate(createSourceSchema), createSource);

router.route('/:id')
    .get(getSourceById)
    .put(validate(updateSourceSchema), updateSource)
    .delete(deleteSource);
export default router;