import React from 'react';
import '../styles/main.css';

const PermissionTable = ({ permissions, onDelete, onEdit }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Permission ID</th>
            <th>Permission Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map(permission => (
            <tr key={permission.permission_id}>
              <td>{permission.permission_id}</td>
              <td>{permission.permission_name}</td>
              <td>
                <button 
                  className="action-button edit" 
                  onClick={() => onEdit(permission)}
                >
                  Edit
                </button>
                <button 
                  className="action-button delete" 
                  onClick={() => onDelete(permission.permission_id)}
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

export default PermissionTable;