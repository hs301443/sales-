import express from 'express';
import { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity} from '../../controllers/admin/activityController.js';
import { validate } from '../../middlewares/validation.js';
import { createActivitySchema, updateActivitySchema } from '../../validation/admin/activityValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllActivities)
    .post(validate(createActivitySchema), createActivity);

router.route('/:id')
    .get(getActivityById)
    .put(validate(updateActivitySchema), updateActivity)
    .delete(deleteActivity);
export default router;