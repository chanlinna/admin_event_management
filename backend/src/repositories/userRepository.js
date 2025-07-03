// All queries related to users
import db from '../config/db.js';

// create new user
export const createUser = async (username, password, roleId) => {
  await db.query(`CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}'`);
  const [res] = await db.query(
    'INSERT INTO db_user (username, password, role_id) VALUES (?, ?, ?)',
    [username, password, roleId]
  );
  return res.insertId;
};


// get all users with their roles
export const getUsersWithRoles = async () => {
  const [rows] = await db.query(
    `SELECT u.user_id, u.username, r.role_name
     FROM db_user u
     LEFT JOIN db_role r ON u.role_id = r.role_id`
  );
  return rows;
};

// Update (rename) user + password + roleId
export const updateUser = async (id, newUsername, newPassword, roleId, oldUsername) => {
  // Rename MySQL user
  await db.query(`RENAME USER '${oldUsername}'@'localhost' TO '${newUsername}'@'localhost'`);
  // Update password
  await db.query(`ALTER USER '${newUsername}'@'localhost' IDENTIFIED BY '${newPassword}'`);
  // Update role in your table
  await db.query(
    'UPDATE db_user SET username = ?, password = ?, role_id = ? WHERE user_id = ?',
    [newUsername, newPassword, roleId, id]
  );
};

// delete user
export const deleteUser = async (id, username) => {
  await db.query(`DROP USER '${username}'@'localhost'`);
  await db.query('DELETE FROM db_user WHERE user_id = ?', [id]);
};


export const assignRoleToUser = async (username, roleId) => {
  // Get role name by roleId
  const [[role]] = await db.query('SELECT role_name FROM db_role WHERE role_id = ?', [roleId]);
  if (!role) throw new Error('Role not found');

  // Update user's role_id in your app table
  await db.query('UPDATE db_user SET role_id = ? WHERE username = ?', [roleId, username]);

  // Grant MySQL role to user
  await db.query(`GRANT '${role.role_name}' TO '${username}'@'localhost'`);
};

export const revokeRoleFromUser = async (username, roleId) => {
  // Get role name by roleId
  const [[role]] = await db.query('SELECT role_name FROM db_role WHERE role_id = ?', [roleId]);
  if (!role) throw new Error('Role not found');

  // Remove role assignment in your user table
  await db.query('UPDATE db_user SET role_id = NULL WHERE username = ?', [username]);

  // Revoke MySQL role from user
  await db.query(`REVOKE '${role.role_name}' FROM '${username}'@'localhost'`);
};
