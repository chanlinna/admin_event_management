//  All queries related to roles
import db from '../config/db.js';

export const createRole = async (roleName) => {
  await db.query(`CREATE ROLE '${roleName}'`);
  const [res] = await db.query('INSERT INTO db_role (role_name) VALUES (?)', [roleName]);
  return res.insertId;
};

export const getAllRoles = async () => {
  const [rows] = await db.query('SELECT * FROM db_role');
  return rows;
};

export const updateRole = async (id, newRoleName) => {
 
  const [[old]] = await db.query('SELECT role_name FROM db_role WHERE role_id = ?', [id]);
  const oldRoleName = old.role_name;

  await db.query(`CREATE ROLE '${newRoleName}'`);

  await db.query(`GRANT '${oldRoleName}' to '${newRoleName}'`);

  await db.query(`DROP ROLE '${oldRoleName}'`);

  await db.query('UPDATE db_role SET role_name = ? WHERE role_id = ?', [newRoleName, id]);
};

export const deleteRole = async (id, roleName) => {
  await db.query(`DROP ROLE '${roleName}'`);
  await db.query('DELETE FROM db_role WHERE role_id = ?', [id]);
};

export const getRolesWithPermissions = async () => {
  const [rows] = await db.query(`
    SELECT r.role_name, p.permission_name AS permission
    FROM db_role r
    JOIN role_permissions rp ON r.role_id = rp.role_id
    JOIN db_permission p ON rp.permission_id = p.permission_id
    ORDER BY r.role_name
  `);
  return rows;
};