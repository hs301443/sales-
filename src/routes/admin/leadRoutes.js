import express from 'express';
import { createLead, getAllLeads, getLeadById, updateLead, deleteLead } from '../../controllers/admin/leadController.js';
import { validate } from '../../middlewares/validation.js';
import { createLeadSchema, updateLeadSchema } from '../../validation/admin/leadValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllLeads)
    .post(validate(createLeadSchema), createLead);

router.route('/:id')
    .get(getLeadById)
    .put(validate(updateLeadSchema), updateLead)
    .delete(deleteLead);

export default router;