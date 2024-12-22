import React from 'react'
import { BrowserRouter as Router, Route, Switch, Navigate } from 'react-router-dom'
import Loginuser from '../pages/LoginUser';
import Signup from '../pages/SignupUser';
import Dashboard from '../pages/Dashboard'

export const AppRoutes = () => {
    // Simulating authentication state (replace with real authentication logic)
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Loginuser />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard/> : <Navigate to="/" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
        </Router>
  )
}