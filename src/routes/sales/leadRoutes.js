import express from 'express';
import { viewAllLeads,  /*viewTransferLead, viewDemoLead, viewApproveLead, viewRejectLead,*/ getLeadById, createLead, updateLead, deleteLead, getSalesmanInterestedLeadsCount, getSalesTargetsDetails, getSalesmanLeadsCount, getSalesTargetsCount, HomeSales, getAllCountryAndCity } from '../../controllers/Sales/LeadController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
import { validate } from '../../middlewares/validation.js';
import { createleadValidation, updateleadValidation } from '../../validation/sales/leadValidation.js';

const router = express.Router();

router.use(verifyToken); 
router.use(verifyRole(Roles.SALESMAN));

/*
router.route('/transferLead').get(viewTransferLead);
router.route('/demoLead').get(viewDemoLead);
router.route('/approveLead').get(viewApproveLead);
router.route('/rejectLead').get(viewRejectLead);
*/
router.route('/interestedCount/:sales_id').get(getSalesmanInterestedLeadsCount);
router.route('/salesTargets').get(getSalesTargetsDetails);
router.route('/leadsCount/:sales_id').get(getSalesmanLeadsCount);
router.route('/salesTargetsCount/:sales_id').get(getSalesTargetsCount);
router.route('/home').get(HomeSales);
router.route('/countries-cities').get(getAllCountryAndCity);


router.route('/')
  .get(viewAllLeads)
  .post(validate(createleadValidation), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validate(updateleadValidation), updateLead)
  .delete(deleteLead);

export default router;