import * as RoleRepo from '../repositories/roleRepository.js';

export const createRole = async (req, res) => {
  try {
    const { roleName } = req.body;
    const roleId = await RoleRepo.createRole(roleName);
    res.status(201).json({ roleId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await RoleRepo.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    await RoleRepo.updateRole(id, roleName);
    res.json({ message: 'Role updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id, roleName } = req.params;
    await RoleRepo.deleteRole(id, roleName);
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRolesWithPermissions = async (req, res) => {
  try {
    const result = await RoleRepo.getRolesWithPermissions();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const roleWithPermissions = await RoleRepo.getRoleById(id);
    
    if (roleWithPermissions.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Transform the data for better frontend consumption
    const response = {
      role_id: parseInt(id),
      role_name: roleWithPermissions[0].role_name,
      permissions: roleWithPermissions.map(perm => ({
        permission_name: perm.permission,
        db_name: perm.dbName,
        table_name: perm.table,
        with_grant_option: perm.with_grant_option === 1 // Convert to boolean
      }))
    };
    
    res.json(response);
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};