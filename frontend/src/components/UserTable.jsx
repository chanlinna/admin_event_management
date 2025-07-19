import React from 'react';
import '../styles/main.css';

// In UserTable.js
const UserTable = ({ users, onEdit, onDelete, onAssignRole, onRevokeRole }) => {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.user_id}>
            <td>{user.user_id}</td>
            <td>{user.username}</td>
            <td>{user.role_name || 'No role'}</td>
            <td className="action-buttons">
              <button onClick={() => onEdit(user)}>Edit</button>
              <button onClick={() => onDelete(user.user_id, user.username)}>Delete</button>
              {user.role_name ? (
                <button 
                  className="revoke-button"
                  onClick={() => onRevokeRole(user.user_id, user.username)}
                >
                  Revoke Role
                </button>
              ) : (
                <button 
                  className="assign-button"
                  onClick={() => onAssignRole(user)}
                >
                  Assign Role
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;