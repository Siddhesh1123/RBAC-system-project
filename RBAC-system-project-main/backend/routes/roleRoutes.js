const express = require('express');
const {
  createRole,
  getRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const {
  authenticate,
  authorizePermission,
} = require('../middlewares/authMiddleware');
const router = express.Router();

// POST /api/roles - Create role (Admin only)
router.post('/', authenticate, authorizePermission('67447ddd870d4b271419264e'), createRole); // Permission ID for "role:create"

// GET /api/roles/:id - View role (Viewer and above)
router.get('/:id', authenticate, authorizePermission('67447ddd870d4b2714192653'), getRole); // Permission ID for "role:read"

// PUT /api/roles/:id - Update role (Admin only)
router.put('/:id', authenticate, authorizePermission('67447ddd870d4b2714192654'), updateRole); // Permission ID for "role:update"

// DELETE /api/roles/:id - Delete role (Admin only)
router.delete('/:id', authenticate, authorizePermission('67447ddd870d4b2714192652'), deleteRole); // Permission ID for "role:delete"

module.exports = router;
