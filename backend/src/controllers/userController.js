// # Handle logic for user CRUD operations and fetching users with roles
// call repositories`
import * as userRepo from "../repositories/userRepository.js";

export const createUser = async (req, res) => {
  try {
    console.log("Received body:", req.body); // Add this to debug

    const { username, password, role_id } = req.body;

    if (!username || !password || !role_id) {
      return res.status(400).json({ error: "username, password, and role_id are required" });
    }

    const userId = await userRepo.createUser({ username, password, role_id });
    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const affected = await userRepo.deleteUser(user_id);

    if (affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const { username, password, role_id } = req.body;

    const affected = await userRepo.updateUser(user_id, { username, password, role_id });

    if (affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
