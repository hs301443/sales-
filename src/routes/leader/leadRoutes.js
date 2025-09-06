import express from 'express';
import { viewLead, transferLead } from '../../controllers/Leader/LeadController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
import { validate } from '../../middlewares/validation.js';
import { transferLead } from '../../validation/leader/leadValidation.js';

const router = express.Router();
  

// Apply authentication to all routes
router.use(verifyToken);

// Apply role-based authorization - only Leaders can access these routes
router.use(verifyRole(Roles.LEADER));

// GET /api/user/leads - View all leads under leader's team
router.get('/', viewLead);

// POST /api/user/leads/transfer/:userId - Transfer leads to another user
router.post('/transfer/:userId', validate(transferLead), transferLead);

router.get('/company', viewCompanyLead);
router.post('/determine_sales/:userId', validate(transferLead), determineSales);

export default router;