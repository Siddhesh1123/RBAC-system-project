const Permission = require('../models/Permission');

// Add Permission
exports.addPermission = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the permission name already exists
    const existingPermission = await Permission.findOne({ name });
    if (existingPermission) {
      return res.status(400).json({ message: 'Permission already exists' });
    }

    // Create a new permission
    const newPermission = new Permission({
      name,
      description,
    });

    // Save to the database
    await newPermission.save();

    res.status(201).json({
      message: 'Permission created successfully',
      permission: newPermission,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
