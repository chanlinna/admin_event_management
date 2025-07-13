// Define Express routes/endpoints for role-related API calls
import express from 'express';
import * as RoleController from '../controllers/roleController.js';
const router = express.Router();

router.get('/', RoleController.getRoles);
router.post('/', RoleController.createRole);
router.put('/:id', RoleController.updateRole);
router.delete('/:id/:roleName', RoleController.deleteRole);
router.get('/with-permissions', RoleController.getRolesWithPermissions);
router.get('/:id', RoleController.getRoleById);

export default router;
