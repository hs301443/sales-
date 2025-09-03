import express from 'express';
import { validate } from '../../middlewares/validation.js';
import { CreateUserSchema, UpdateUserSchema } from '../../validation/admin/userValidator.js';

const router = express.Router();

import  { createUser, getAllUsers, getUserById, deleteUser, updateUser }  from '../../controllers/admin/userController.js';


router.route('/')
  .get(getAllUsers)
  .post(validate(CreateUserSchema), createUser);

router.route('/:id')
  .get(getUserById)
  .put(validate(UpdateUserSchema),updateUser)
  .delete(deleteUser);


  export default router;