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
router.get('/', authenticate, authorizePermission('user:read'), getAllUsers);

// POST /api/users - Create user (Admin only)
router.post('/', authenticate, authorizePermission('user:create'), createUser);

// GET /api/users/:id - View a specific user by ID (Viewer and above)
router.get('/:id', authenticate, authorizePermission('user:read'), getUser);

// PUT /api/users/:id - Update user (Editor and Admin)
router.put('/:id', authenticate, authorizePermission('user:update'), updateUser);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticate, authorizePermission('user:delete'), deleteUser);

module.exports = router;
