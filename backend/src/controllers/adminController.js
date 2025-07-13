import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AdminRepo from "../repositories/adminRepository.js";

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

//Register
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'userName, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await AdminRepo.registerAdmin(userName, email, hashedPassword);
    
    res.status(201).json({ userId });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await AdminRepo.findAdminByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Debug: log the user object to verify structure
    console.log('User from DB:', user);

    // Make sure we're using the correct password field name
    const passwordField = user.hashed_password || user.password;
    if (!passwordField) {
      return res.status(500).json({ error: 'Password field not found in user object' });
    }

    const isPasswordValid = await bcrypt.compare(password, passwordField);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id || user.userId }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        userId: user.user_id || user.userId,
        userName: user.user_name || user.userName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};
