import React from 'react';
import '../styles/main.css';

const UserTable = ({ users, onEdit, onDelete, onRevokeRole }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
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
              <td>{user.role_name || 'No Role'}</td>
              <td className="actions-cell">
                <button 
                  className="action-button edit"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                {user.role_name && (
                  <button 
                    className="action-button revoke"
                    onClick={() => onRevokeRole(user.user_id, user.username)}
                  >
                    Revoke Role
                  </button>
                )}
                <button 
                  className="action-button delete" 
                  onClick={() => onDelete(user.user_id, user.username)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;