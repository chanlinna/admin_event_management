import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/main.css';

const RolePermissions = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/roles/${roleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch role permissions');
        
        const roleData = await response.json();
        setRole(roleData);
      } catch (error) {
        console.error('Error:', error);
        alert(`Failed to load permissions: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRolePermissions();
  }, [roleId]);

  if (isLoading) return (
    <div className="app-container">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-content">
        <div className="loading">Loading permissions...</div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="main-content">
        <div className="role-permissions-container">
          <button 
            className="action-button back"
            onClick={() => navigate('/roles')}
          >
            Back to Roles
          </button>
          
          {role ? (
            <>
              <h2>Permissions for {role.role_name}</h2>
              {role.permissions?.length > 0 ? (
                <div className="table-container">
                  <table className="permissions-table">
                    <thead>
                      <tr>
                        <th>Permission</th>
                        <th>Database</th>
                        <th>Table</th>
                        <th>Grant Option</th>
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((perm, index) => (
                        <tr key={index}>
                          <td>{perm.permission_name || perm.name}</td>
                          <td>{perm.db_name || perm.db || 'N/A'}</td>
                          <td>{perm.table_name || perm.table || 'N/A'}</td>
                          <td>
                            {Boolean(perm.with_grant_option) ? 'Yes' : 'No'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-permissions">No permissions assigned to this role</p>
              )}
            </>
          ) : (
            <p className="not-found">Role not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;