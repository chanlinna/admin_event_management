//  # Handle logic for creating, reading, updating, deleting roles
// call repositories
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