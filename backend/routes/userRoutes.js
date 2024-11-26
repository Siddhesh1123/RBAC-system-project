const express = require('express');
const {
  createUser,
  getUser,
  getAllUsers, // Add this
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticate, authorizePermission } = require('../middlewares/authMiddleware');
const router = express.Router();

// GET /api/users - List all users (Viewer and above)
router.get('/', authenticate, authorizePermission('67447ddd870d4b271419264f'), getAllUsers); // Permission ID for "user:read"

// POST /api/users - Create user (Admin only)
router.post('/', authenticate, authorizePermission('67447ddd870d4b271419264e'), createUser); // Permission ID for "user:create"

// GET /api/users/:id - View a specific user by ID (Viewer and above)
router.get('/:id', authenticate, authorizePermission('67447ddd870d4b271419264f'), getUser); // Permission ID for "user:read"

// PUT /api/users/:id - Update user (Editor and Admin)
router.put('/:id', authenticate, authorizePermission('67447ddd870d4b2714192650'), updateUser); // Permission ID for "user:update"

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticate, authorizePermission('67447ddd870d4b2714192651'), deleteUser); // Permission ID for "user:delete"

module.exports = router;
