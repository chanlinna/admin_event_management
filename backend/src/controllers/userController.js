// # Handle logic for user CRUD operations and fetching users with roles
// call repositories`
import * as userRepo from "../repositories/userRepository.js";

export const createUser = async (req, res) => {
  try {
    const { username, password, role_id } = req.body;
    if (!username || !password || !role_id) {
      return res.status(400).json({ error: "username, password, and role_id are required" });
    }
    const createdUsername = await userRepo.createUser({ username, password, role_id });
    res.status(201).json({ message: "User created", username: createdUsername });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const username = req.params.username;  // changed from user_id to username
    const { password, role_id } = req.body;
    const result = await userRepo.updateUser(username, { password, role_id });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const username = req.params.username;  // changed from user_id to username
    await userRepo.deleteUser(username);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
