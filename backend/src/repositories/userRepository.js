import { pool } from "../config/db.js";

const DB_NAME = 'event_management'; // Your actual database name

export const createUser = async ({ username, password, role_id }) => {
  const [roles] = await pool.query(
    "SELECT role_name FROM db_role WHERE role_id = ?",
    [role_id]
  );
  if (roles.length === 0) throw new Error("Invalid role_id");

  const roleName = roles[0].role_name;

  // Create user
  await pool.query(`CREATE USER '${username}'@'localhost' IDENTIFIED BY '${password}'`);

  // Grant privileges based on role_name exactly as your definitions:
  if (roleName === "dadabase_administrator") {
    await pool.query(`GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${username}'@'localhost'`);
  } else if (roleName === "senior_developer") {
    await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.* TO '${username}'@'localhost'`);
  } else if (roleName === "junior_developer") {
    await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.participants TO '${username}'@'localhost'`);
    await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.events TO '${username}'@'localhost'`);
    await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.event_participants TO '${username}'@'localhost'`);
  } else if (roleName === "data_analyst") {
    await pool.query(`GRANT SELECT ON ${DB_NAME}.* TO '${username}'@'localhost'`);
  } else if (roleName === "intern") {
    await pool.query(`GRANT SELECT, INSERT, UPDATE ON ${DB_NAME}.participants TO '${username}'@'localhost'`);
    // Note: The 90 days limitation for intern should be handled separately (not via GRANT)
  } else {
    throw new Error(`Role '${roleName}' has no permission mapping`);
  }

  await pool.query("FLUSH PRIVILEGES");

  return username;
};

export const updateUser = async (username, { password, role_id }) => {
  await pool.query(`ALTER USER '${username}'@'localhost' IDENTIFIED BY '${password}'`);

  if (role_id) {
    const [roles] = await pool.query(
      "SELECT role_name FROM db_role WHERE role_id = ?",
      [role_id]
    );
    if (roles.length === 0) throw new Error("Invalid role_id");

    const roleName = roles[0].role_name;

    // Revoke all existing privileges
    await pool.query(`REVOKE ALL PRIVILEGES, GRANT OPTION FROM '${username}'@'localhost'`);

    // Re-grant based on updated role
    if (roleName === "dadabase_administrator") {
      await pool.query(`GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${username}'@'localhost'`);
    } else if (roleName === "senior_developer") {
      await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.* TO '${username}'@'localhost'`);
    } else if (roleName === "junior_developer") {
      await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.participants TO '${username}'@'localhost'`);
      await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.events TO '${username}'@'localhost'`);
      await pool.query(`GRANT CREATE VIEW, SELECT, INSERT, UPDATE ON ${DB_NAME}.event_participants TO '${username}'@'localhost'`);
    } else if (roleName === "data_analyst") {
      await pool.query(`GRANT SELECT ON ${DB_NAME}.* TO '${username}'@'localhost'`);
    } else if (roleName === "intern") {
      await pool.query(`GRANT SELECT, INSERT, UPDATE ON ${DB_NAME}.participants TO '${username}'@'localhost'`);
    } else {
      throw new Error(`Role '${roleName}' has no permission mapping`);
    }
  }

  await pool.query("FLUSH PRIVILEGES");

  return true;
};

export const deleteUser = async (username) => {
  await pool.query(`DROP USER '${username}'@'localhost'`);
  await pool.query("FLUSH PRIVILEGES");
  return true;
};
