const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Middleware to verify the JWT token
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with secret
    console.log('Decoded Token:', decoded); // Debugging log

    // Fetch the user based on the userId from the token and exclude password
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { id: user._id, username: user.username, role: user.role };  // Attach user to the request
    next();  // Proceed to the next middleware
  } catch (err) {
    console.error('Error during authentication:', err.message); // Debugging log
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

// Middleware to check if the user has the required role
const authorizeRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user.role) {
        return res.status(400).json({ message: 'User role not available in the request' });
      }

      // Fetch the user's role from the database
      const userRole = await Role.findById(req.user.role);
      if (!userRole) {
        return res.status(404).json({ message: 'Role not found for user' });
      }

      // Check if the user has one of the allowed roles
      if (!roles.includes(userRole.name)) {
        return res.status(403).json({ message: `Access denied. Role '${userRole.name}' not authorized.` });
      }

      next();  // Proceed to the next middleware
    } catch (err) {
      console.error('Error during role authorization:', err.message); // Debugging log
      res.status(500).json({ message: `Failed to verify user role: ${err.message}` });
    }
  };
};

// Middleware to check if the user has specific permissions
const authorizePermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      // Fetch the user with role and permissions populated
      const user = await User.findById(req.user.id).populate({
        path: 'role',
        populate: {
          path: 'permissions',
        },
      });

      // Ensure role and permissions exist
      if (!user || !user.role || !user.role.permissions) {
        return res.status(404).json({ message: 'Role or permissions not found for user' });
      }

      const userPermissions = user.role.permissions.map((perm) => perm._id.toString());
      // console.log('User Permissions:', userPermissions); // Debugging log

      // Check if all required permissions are present in the user's permissions
      const missingPermissions = requiredPermissions.filter(
        (perm) => !userPermissions.includes(perm.toString())
      );

      if (missingPermissions.length > 0) {
        return res.status(403).json({
          message: `Access denied. Missing permissions: ${missingPermissions.join(', ')}`,
        });
      }

      next(); // Proceed to the next middleware
    } catch (err) {
      console.error('Error during permission authorization:', err.message); // Debugging log
      res.status(500).json({ message: `Failed to verify permissions: ${err.message}` });
    }
  };
};


module.exports = { authenticate, authorizeRole, authorizePermission };
