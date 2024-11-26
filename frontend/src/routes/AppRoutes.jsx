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
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Loginuser />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />

        {/* Protected Route */}
        <Route
          path="/home"
          element={isAuthenticated ? <Dashboard/> : <Navigate to="/login" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
        </Router>
  )
}
