// All queries related to users
import db from '../config/db.js';

// create new user
export const createUser = async (username, password, roleId) => {
  await db.query(`CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}'`);
  await db.query(`GRANT (SELECT) ON *.* TO '${username}'@'localhost'`); // optional default grant
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

// update user
export const updateUser = async (id, username, password, roleId) => {
  await db.query(`ALTER USER '${username}'@'localhost' IDENTIFIED BY '${password}'`);
  await db.query(
    'UPDATE db_user SET username = ?, password = ?, role_id = ? WHERE user_id = ?',
    [username, password, roleId, id]
  );
};

// delete user
export const deleteUser = async (id, username) => {
  await db.query(`DROP USER '${username}'@'localhost'`);
  await db.query('DELETE FROM db_user WHERE user_id = ?', [id]);
};


// assign a role to a user
export const assignRoleToUser = async (username, roleName) => {
  await db.query(`GRANT '${roleName}' TO '${username}'@'localhost'`);
};
