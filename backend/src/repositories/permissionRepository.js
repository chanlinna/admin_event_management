import db from '../config/db.js';

export const createPermission = async (name) => {
  const [res] = await db.query('INSERT INTO db_permission (permission_name) VALUES (?)', [name]);
  return res.insertId;
};

export const getAllPermissions = async () => {
  const [rows] = await db.query('SELECT * FROM db_permission');
  return rows;
};

export const updatePermission = async (id, newName) => {
  await db.query('UPDATE db_permission SET permission_name = ? WHERE permission_id = ?', [newName, id]);
};

export const deletePermission = async (id) => {
  await db.query('DELETE FROM db_permission WHERE permission_id = ?', [id]);
};

export const assignPermissionToRole = async (roleName, permissionName, dbName) => {
  // Get role and permission ids
  const [[role]] = await db.query('SELECT role_id FROM db_role WHERE role_name = ?', [roleName]);
  const [[permission]] = await db.query('SELECT permission_id FROM db_permission WHERE permission_name = ?', [permissionName]);

  if (!role || !permission) throw new Error('Role or permission not found');

  // Grant in MySQL and insert into pivot table
  await db.query(`GRANT ${permissionName} ON ${dbName}.* TO '${roleName}'`);
  await db.query('INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [role.role_id, permission.permission_id]);
};

export const revokePermissionToRole = async (roleName, permissionName, dbName) => {
  // Get role and permission ids
  const [[role]] = await db.query('SELECT role_id FROM db_role WHERE role_name = ?', [roleName]);
  const [[permission]] = await db.query('SELECT permission_id FROM db_permission WHERE permission_name = ?', [permissionName]);

  if (!role || !permission) throw new Error('Role or permission not found');

  // Revoke permission in MySQL
  await db.query(`REVOKE ${permissionName} ON ${dbName}.* FROM '${roleName}'`);

  // Remove from pivot table
  await db.query('DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?', [role.role_id, permission.permission_id]);
};
