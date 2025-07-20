
import express from 'express';
import * as UserController from '../controllers/userController.js';
const router = express.Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id/:username', UserController.deleteUser);
router.post('/assign-role', UserController.assignRole);
router.post('/:id/revoke-role', UserController.revokeRoleFromUser);
export default router;