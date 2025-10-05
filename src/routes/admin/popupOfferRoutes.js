import express from 'express';
import {
  createPopupOffer,
  getPopupOffers,
  getPopupOfferById,
  updatePopupOffer,
  deletePopupOffer
} from '../../controllers/admin/popupOfferController.js';

import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
  .post(createPopupOffer)
  .get(getPopupOffers);

router.route('/:id')
  .get(getPopupOfferById)
  .put(updatePopupOffer)
  .delete(deletePopupOffer);

export default router;