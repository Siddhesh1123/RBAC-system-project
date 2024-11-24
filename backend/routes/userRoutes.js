const express = require('express');
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticate, authorizePermission } = require('../middlewares/authMiddleware');
const router = express.Router();

// POST /api/users - Create user (Admin only)
router.post('/', authenticate, authorizePermission('user:create'), createUser);

// GET /api/users/:id - View user (Viewer and above)
router.get('/:id', authenticate, authorizePermission('user:read'), getUser);

// PUT /api/users/:id - Update user (Editor and Admin)
router.put('/:id', authenticate, authorizePermission('user:update'), updateUser);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticate, authorizePermission('user:delete'), deleteUser);

module.exports = router;
