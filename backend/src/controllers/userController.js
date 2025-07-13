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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserRepo.getUserById(id);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]); // Return the first user found
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUsername, newPassword, roleId, oldUsername } = req.body;
    
    // Make fields optional except oldUsername
    if (!oldUsername) {
      return res.status(400).json({ error: 'oldUsername is required' });
    }
    
    await UserRepo.updateUser(
      id, 
      newUsername || undefined, 
      newPassword || undefined, 
      roleId || undefined, 
      oldUsername
    );
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

export const revokeRoleFromUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'username is required' });
    }

    // Get user data - properly handle the query result
    const userRows = await UserRepo.getUserById(id);
    
    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0]; // Get the first user
    
    if (!user.role_id) {
      return res.status(400).json({ error: 'User has no role assigned' });
    }

    // Revoke the role
    await UserRepo.revokeRoleFromUser(username, user.role_id);
    
    return res.json({ 
      message: 'Role revoked successfully',
      userId: id,
      username: username,
      revokedRoleId: user.role_id
    });
    
  } catch (error) {
    console.error('Error revoking role:', error);
    res.status(500).json({ 
      error: 'Failed to revoke role',
      details: error.message
    });
  }
};