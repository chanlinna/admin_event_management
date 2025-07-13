import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Permissions from './pages/Permissions';
import RolePermissions from './components/RolePermissions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/roles/:roleId/permissions" element={<RolePermissions />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;