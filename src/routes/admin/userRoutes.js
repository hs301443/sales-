import express from 'express';
import { validate } from '../../middlewares/validation.js';
import { CreateUserSchema, UpdateUserSchema } from '../../validation/admin/userValidator.js';
import  { createUser, getAllUsers, getUserById, deleteUser, updateUser }  from '../../controllers/admin/userController.js';

import { verifyToken } from '../../middlewares/verifyToken.js';
import { verifyRole } from '../../middlewares/verifyRole.js';
import { Roles } from '../../utils/Roles.js';
const router = express.Router();

//router.use(verifyToken);
//router.use(verifyRole(Roles.ADMIN));

router.route('/')
  .get(getAllUsers)
  .post(validate(CreateUserSchema), createUser);

router.route('/:id')
  .get(getUserById)
  .put(validate(UpdateUserSchema),updateUser)
  .delete(deleteUser);


  export default router;