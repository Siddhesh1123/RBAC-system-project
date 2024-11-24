const express = require('express');
const { addPermission } = require('../controllers/permissionController');
const {
  authenticate,
  authorizePermission,
} = require('../middlewares/authMiddleware');
const router = express.Router();

// POST /api/permissions/add - Add permission (Admin only)
router.post('/add', authenticate, authorizePermission('permission:create'), addPermission);

// GET /api/permissions/view - View all permissions (Viewer and above)
router.get('/view', authenticate, authorizePermission('permission:read'), async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ permissions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
