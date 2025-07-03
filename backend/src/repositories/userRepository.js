// All queries related to users
import { pool } from "../config/db.js";

export const createUser = async ({ username, password, role_id }) => {
  const [result] = await pool.query(
    "INSERT INTO db_user (username, password, role_id) VALUES (?, ?, ?)",
    [username, password, role_id]
  );
  return result.insertId;
};

export const updateUser = async (user_id, { username, password, role_id }) => {
  const [result] = await pool.query(
    "UPDATE db_user SET username = ?, password = ?, role_id = ? WHERE user_id = ?",
    [username, password, role_id, user_id]
  );
  return result.affectedRows;
};

export const deleteUser = async (user_id) => {
  const [result] = await pool.query(
    "DELETE FROM db_user WHERE user_id = ?",
    [user_id]
  );
  return result.affectedRows;
};
