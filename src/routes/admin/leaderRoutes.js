import express from 'express';
import { createLeader, getAllLeaders, getLeaderById, updateLeader, deleteLeader } from '../../controllers/admin/leaderController.js';
import { validate } from '../../middlewares/validation.js';
import { createLeaderSchema, updateLeaderSchema } from '../../validation/admin/leaderValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllLeaders)
    .post(validate(createLeaderSchema), createLeader);

router.route('/:id')
    .get(getLeaderById)
    .put(validate(updateLeaderSchema), updateLeader)
    .delete(deleteLeader);

export default router;