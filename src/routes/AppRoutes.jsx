import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { ProtectedRoute } from '../components/Auth/AuthProvider';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    {/* Add more routes as needed */}
  </Routes>
);

export default AppRoutes;