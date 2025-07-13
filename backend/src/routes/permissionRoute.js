import express from 'express';
import * as PermissionController from '../controllers/permissionController.js';

const router = express.Router();

router.get('/', PermissionController.getPermissions);
router.post('/', PermissionController.createPermission);
router.put('/:id', PermissionController.updatePermission);
router.delete('/:id', PermissionController.deletePermission);
router.post('/assign', PermissionController.assignPermission);
router.post('/revoke', PermissionController.revokePermission);
router.post('/assign-to-user', PermissionController.assignPermissionToUser);
router.post('/revoke-from-user', PermissionController.revokePermissionFromUser);

export default router;
