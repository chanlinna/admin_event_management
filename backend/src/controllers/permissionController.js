import * as PermissionRepo from '../repositories/permissionRepository.js';
import db from '../config/db.js';
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
    const { roleName, permissionName, dbName, table, withGrantOption } = req.body;

    if (!roleName || !permissionName || !dbName || !table) {
      return res.status(400).json({ 
        error: 'roleName, permissionName, dbName, and table are required' 
      });
    }

    console.log('Received request with withGrantOption:', withGrantOption, typeof withGrantOption);
    
    const grantOption = Boolean(withGrantOption)
    console.log('Converted grantOption:', grantOption);

    await PermissionRepo.assignPermissionToRole(
      roleName, 
      permissionName, 
      dbName, 
      table, 
      grantOption
    );
    
    // Verify the update
    const [updated] = await db.query(
      'SELECT with_grant_option FROM role_permissions WHERE role_id = ? AND permission_id = ? AND dbName = ? AND `table` = ?',
      [/* get these IDs from your DB */]
    );
    
    console.log('Updated record verification:', updated);
    
    res.json({ 
      message: `Permission ${permissionName} granted to role ${roleName} on ${dbName}.${table}` +
               (grantOption ? ' WITH GRANT OPTION' : ''),
      withGrantOption: grantOption
    });
  } catch (err) {
    console.error('Error in controller:', err);
    res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const revokePermission = async (req, res) => {
  try {
    const { roleName, permissionName, dbName, table } = req.body;
    if (!roleName || !permissionName || !dbName || !table) {
      return res.status(400).json({ error: 'roleName, permissionName, dbName, and table are required' });
    }

    await PermissionRepo.revokePermissionToRole(roleName, permissionName, dbName, table);
    res.json({message: `Revoked ${permissionName} on ${dbName}.${table} from ${roleName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignPermissionToUser = async (req, res) => {
  try {
    const { username, permissionName, dbName, table } = req.body;
    if (!username || !permissionName || !dbName || !table) {
      return res.status(400).json({ error: 'username, permissionName, dbName, and table are required' });
    }

    await PermissionRepo.assignPermissionToUser(username, permissionName, dbName, table);
    res.json({ message: `Permission ${permissionName} granted to user ${username} on ${dbName}.${table}` });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const revokePermissionFromUser = async (req, res) => {
  try {
    const { username, permissionName, dbName, table } = req.body;
    if (!username || !permissionName || !dbName || !table) {
      return res.status(400).json({ error: 'username, permissionName, dbName, and table are required' });
    }

    await PermissionRepo.revokePermissionFromUser(username, permissionName, dbName, table);
    res.json({ message: `Revoked ${permissionName} on ${dbName}.${table} from ${username}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};