import db from '../config/db.js';

export const registerAdmin = async (userName, email, hashedPassword) => {
  const [res] = await db.query('INSERT INTO user (user_name, email, hashed_password) VALUES (?, ?, ?)', 
    [userName, email, hashedPassword]);
  return res.insertId;
}

export const findAdminByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    
    return rows[0] || null;
  } catch (err) {
    console.error('Error finding admin by email:', err);
    throw err; 
  }
};