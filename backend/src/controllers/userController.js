// # Handle logic for user CRUD operations and fetching users with roles
// call repositories
import * as UserRepo from '../repositories/userRepository.js';

export const createUser = async (req, res) => {
  try {
    const { username, password, roleId } = req.body;
    const userId = await UserRepo.createUser(username, password, roleId);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserRepo.getUsersWithRoles();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUsername, newPassword, roleId, oldUsername } = req.body;
    if (!newUsername || !newPassword || !roleId || !oldUsername) {
      return res.status(400).json({ error: 'newUsername, newPassword, roleId and oldUsername required' });
    }
    await UserRepo.updateUser(id, newUsername, newPassword, roleId, oldUsername);
    res.json({ message: 'User updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id, username } = req.params;
    await UserRepo.deleteUser(id, username);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignRole = async (req, res) => {
  try {
    const { username, roleId } = req.body;
    if (!username || !roleId) {
      return res.status(400).json({ error: 'username and roleId required' });
    }

    await UserRepo.assignRoleToUser(username, roleId);
    res.json({ message: `Role assigned to user ${username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const revokeRole = async (req, res) => {
  try {
    const { username, roleId } = req.body;
    if (!username || !roleId) {
      return res.status(400).json({ error: 'username and roleId required' });
    }

    await UserRepo.revokeRoleFromUser(username, roleId);
    res.json({ message: `Role revoked from user ${username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};