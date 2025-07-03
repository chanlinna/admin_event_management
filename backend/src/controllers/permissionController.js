import * as PermissionRepo from '../repositories/permissionRepository.js';

export const createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    const id = await PermissionRepo.createPermission(name);
    res.status(201).json({ permission_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPermissions = async (req, res) => {
  try {
    const permissions = await PermissionRepo.getAllPermissions();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await PermissionRepo.updatePermission(id, name);
    res.json({ message: 'Permission updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    await PermissionRepo.deletePermission(id);
    res.json({ message: 'Permission deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignPermission = async (req, res) => {
  try {
    const { roleName, permissionName, dbName } = req.body;
    await PermissionRepo.assignPermissionToRole(roleName, permissionName, dbName);
    res.json({ message: `Granted ${permissionName} on ${dbName}.* to ${roleName}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const revokePermission = async (req, res) => {
  try {
    const { roleName, permissionName, dbName } = req.body;
    if (!roleName || !permissionName || !dbName) {
      return res.status(400).json({ error: 'roleName, permissionName, and dbName are required' });
    }

    await PermissionRepo.revokePermissionToRole(roleName, permissionName, dbName);
    res.json({ message: `Permission ${permissionName} revoked from role ${roleName} on database ${dbName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};