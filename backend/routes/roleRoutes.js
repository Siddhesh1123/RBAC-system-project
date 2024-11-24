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
router.post('/', authenticate, authorizePermission('role:create'), createRole);

// GET /api/roles/:id - View role (Viewer and above)
router.get('/:id', authenticate, authorizePermission('role:read'), getRole);

// PUT /api/roles/:id - Update role (Admin only)
router.put('/:id', authenticate, authorizePermission('role:update'), updateRole);

// DELETE /api/roles/:id - Delete role (Admin only)
router.delete('/:id', authenticate, authorizePermission('role:delete'), deleteRole);

module.exports = router;
