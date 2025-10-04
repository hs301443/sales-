import { Router } from 'express';
import { getAllCountries, createCountry, getAllCities, createCity } from '../../controllers/admin/locationController.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
const router = Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/countries')
    .get(getAllCountries)
    .post(createCountry);

router.route('/cities')
    .get(getAllCities)
    .post(createCity);

export default router;