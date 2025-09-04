import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from '../../controllers/admin/productController.js';
import { validate } from '../../middlewares/validation.js';
import { createProductSchema, updateProductSchema } from '../../validation/admin/productValidator.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(Roles.ADMIN));

router.route('/')
    .get(getAllProducts)
    .post(validate(createProductSchema), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(validate(updateProductSchema), updateProduct)
    .delete(deleteProduct);
export default router;