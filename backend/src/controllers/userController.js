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
    const { username, password, roleId } = req.body;
    await UserRepo.updateUser(id, username, password, roleId);
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
    const { username, roleName } = req.body;
    await UserRepo.assignRoleToUser(username, roleName);
    res.json({ message: `Role ${roleName} assigned to ${username}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};