import express from 'express';
import { createScheduledContact, getMyScheduledContacts } from '../../controllers/Sales/ScheduledContactController.js';
import { createScheduledContactValidation, updateScheduledContactValidation } from '../../validation/sales/scheduledContactValidation.js';
import { validate } from '../../middlewares/validation.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

router.route('/schedule-contact').post((validate(createScheduledContactValidation)), createScheduledContact);
router.route('/my-scheduled-contacts').get(getMyScheduledContacts);

export default router;