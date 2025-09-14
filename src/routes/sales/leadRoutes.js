import express from 'express';
import { viewLead, viewTransferLead, viewDemoLead, viewApproveLead, viewRejectLead, getLeadById, createLead, updateLead, deleteLead, getSalesmanInterestedLeadsCount, getSalesTargetsDetails, getSalesmanLeadsCount } from '../../controllers/Sales/LeadController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
import { validate } from '../../middlewares/validation.js';
import { leadValidation } from '../../validation/sales/leadValidation.js';

const router = express.Router();
 
router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));


router.route('/').get(viewLead)
.post(validate(leadValidation), createLead);
router.route('/transferLead').get(viewTransferLead);
router.route('/demoLead').get(viewDemoLead);
router.route('/approveLead').get(viewApproveLead);
router.route('/rejectLead').get(viewRejectLead);
router.route('/interestedCount/:sales_id').get(getSalesmanInterestedLeadsCount);
router.route('/salesTargets/:sales_id').get(getSalesTargetsDetails);
router.route('/leadsCount/:sales_id').get(getSalesmanLeadsCount);

router.route('/:id')
    .get(getLeadById)
    .put(updateLead)
    .delete(deleteLead);

export default router;