const express = require('express');
const { addPermission } = require('../controllers/permissionController');
const {
  authenticate,
  authorizePermission,
} = require('../middlewares/authMiddleware');
const Permission = require('../models/Permission');
const router = express.Router();

// POST /api/permissions/add - Add permission (Admin only)
router.post(
  '/add',
  authenticate,
  authorizePermission('67447ddd870d4b271419264e'), // Permission ID for "permission:create"
  addPermission
);

// GET /api/permissions/view - View all permissions (Viewer and above)
router.get(
  '/view',
  authenticate,
  authorizePermission('67447ddd870d4b2714192653'), // Permission ID for "permission:read"
  async (req, res) => {
    try {
      const permissions = await Permission.find();
      if (!permissions.length) {
        return res.status(404).json({ message: 'No permissions found' });
      }

      res.status(200).json({ permissions });
    } catch (error) {
      console.error('Error retrieving permissions:', error.message); // Log detailed error
      res.status(500).json({ message: `Failed to fetch permissions: ${error.message}` });
    }
  }
);

module.exports = router;
