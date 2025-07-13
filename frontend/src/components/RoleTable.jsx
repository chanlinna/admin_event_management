import React from 'react';
import '../styles/main.css';

const RoleTable = ({ roles, onDelete, onView }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Role ID</th>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.role_id}>
              <td>{role.role_id}</td>
              <td>{role.role_name}</td>
              <td className="actions-cell">
                <button 
                  className="action-button view"
                  onClick={() => onView(role.role_id)}
                >
                  View Permissions
                </button>
                <button 
                  className="action-button delete" 
                  onClick={() => onDelete(role.role_id, role.role_name)}
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

export default RoleTable;