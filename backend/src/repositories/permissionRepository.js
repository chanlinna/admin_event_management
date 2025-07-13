import db from '../config/db.js';

export const createPermission = async (name) => {
  const [res] = await db.query('INSERT INTO db_permissions (permission_name) VALUES (?)', [name]);
  return res.insertId;
};

export const getAllPermissions = async () => {
  const [rows] = await db.query('SELECT * FROM db_permissions');
  return rows;
};

export const updatePermission = async (id, newName) => {
  await db.query('UPDATE db_permissions SET permission_name = ? WHERE permission_id = ?', [newName, id]);
};

export const deletePermission = async (id) => {
  await db.query('DELETE FROM db_permissions WHERE permission_id = ?', [id]);
};

export const assignPermissionToRole = async (roleName, permissionName, dbName, table) => {
  // Get role and permission ids
  const [[role]] = await db.query('SELECT role_id FROM db_role WHERE role_name = ?', [roleName]);
  const [[permission]] = await db.query('SELECT permission_id FROM db_permissions WHERE permission_name = ?', [permissionName]);

  if (!role || !permission) throw new Error('Role or permission not found');

  // Grant in MySQL and insert into pivot table
  await db.query(`GRANT ${permissionName} ON ${dbName}.${table} TO '${roleName}'`);
  await db.query('INSERT INTO role_permissions (role_id, permission_id, dbName, \`table\`) VALUES (?, ?, ?, ?)', 
    [role.role_id, permission.permission_id, dbName, table]
  );
};

export const revokePermissionToRole = async (roleName, permissionName, dbName, table) => {
  // Get role and permission ids
  const [[role]] = await db.query('SELECT role_id FROM db_role WHERE role_name = ?', [roleName]);
  const [[permission]] = await db.query('SELECT permission_id FROM db_permissions WHERE permission_name = ?', [permissionName]);

  if (!role || !permission) throw new Error('Role or permission not found');

  // Revoke permission in MySQL
  await db.query(`REVOKE ${permissionName} ON ${dbName}.${table} FROM '${roleName}'`);

  // Remove from pivot table
  await db.query('DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ? AND dbName = ? AND `table` = ?', 
    [role.role_id, permission.permission_id, dbName, table]);
};

export const assignPermissionToUser = async (username, permissionName, dbName, table) => {
  // Get user ID and permission ID
  const [[user]] = await db.query('SELECT user_id FROM db_user WHERE username = ?', [username]);
  const [[permission]] = await db.query('SELECT permission_id FROM db_permissions WHERE permission_name = ?', [permissionName]);

  if (!user || !permission) throw new Error('User or permission not found');

  // Grant permission in MySQL
  await db.query(`GRANT ${permissionName} ON ${dbName}.${table} TO '${username}'@'localhost'`);

  // Insert into user_permissions table
  await db.query(
    `INSERT IGNORE INTO user_permissions (user_id, permission_id, dbName, \`table\`) VALUES (?, ?, ?, ?)`,
    [user.user_id, permission.permission_id, dbName, table]
  );
};

export const revokePermissionFromUser = async (username, permissionName, dbName, table) => {
  // Get user ID and permission ID
  const [[user]] = await db.query('SELECT user_id FROM db_user WHERE username = ?', [username]);
  const [[permission]] = await db.query('SELECT permission_id FROM db_permissions WHERE permission_name = ?', [permissionName]);

  if (!user || !permission) throw new Error('User or permission not found');

  // Revoke in MySQL
  await db.query(`REVOKE ${permissionName} ON ${dbName}.${table} FROM '${username}'@'localhost'`);

  // Remove from user_permissions table
  await db.query(
    'DELETE FROM user_permissions WHERE user_id = ? AND permission_id = ? AND dbName = ? AND `table` = ?',
    [user.user_id, permission.permission_id, dbName, table]
  );
};
