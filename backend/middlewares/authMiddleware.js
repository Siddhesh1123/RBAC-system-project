const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Middleware to verify the JWT token
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

// Middleware to check if the user has a required role
const authorizeRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const userRole = await Role.findById(req.user.role); // Get user role
      if (!roles.includes(userRole.name)) {
        return res.status(403).json({ message: 'Access denied. Role not authorized.' });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Middleware to check if the user has specific permissions
const authorizePermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      const userRole = await Role.findById(req.user.role).populate('permissions');
      const userPermissions = userRole.permissions.map((perm) => perm.name);

      if (!permissions.every((perm) => userPermissions.includes(perm))) {
        return res.status(403).json({ message: 'Access denied. Permission not granted.' });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { authenticate, authorizeRole, authorizePermission };
