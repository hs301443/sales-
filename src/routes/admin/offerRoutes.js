import express from 'express';
import { createOffer, getAllOffers, getOfferById, updateOffer, deleteOffer } from '../../controllers/admin/offerController.js';
import { validate } from '../../middlewares/validation.js';
import { createOfferSchema, updateOfferSchema } from '../../validation/admin/offerValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllOffers)
    .post(validate(createOfferSchema), createOffer);

router.route('/:id')
    .get(getOfferById)
    .put(validate(updateOfferSchema), updateOffer)
    .delete(deleteOffer);

export default router;