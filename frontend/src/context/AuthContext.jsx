import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state with auth from localStorage if available
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  // Log the token only if auth is not null
  useEffect(() => {
    if (auth) {
      console.log('Auth Token:', auth.token);
      console.log("auth structure", auth) 
    }
  }, [auth]); // Re-run when auth state changes

  // Login function to set the token and store it in localStorage
  const login = (data) => {
    setAuth(data);  // Set auth state with the response data (including the token)
    localStorage.setItem('auth', JSON.stringify(data)); // Save to localStorage
  };

  // Logout function to clear auth state and localStorage
  const logout = () => {
    setAuth(null);  // Clear auth state
    localStorage.removeItem('auth');  // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;