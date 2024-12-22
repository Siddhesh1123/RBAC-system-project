const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Create Role
exports.createRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    // Check if permissions exist
    if (permissions) {
      const permissionDocs = await Permission.find({ '_id': { $in: permissions } });
      if (permissionDocs.length !== permissions.length) {
        return res.status(400).json({ message: 'Some permissions not found' });
      }
    }

    // Create new role
    const newRole = new Role({ name, permissions });
    await newRole.save();

    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Role by ID
exports.getRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findById(id).populate('permissions');
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Role by ID
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  try {
    // Check if permissions exist
    if (permissions) {
      const permissionDocs = await Permission.find({ '_id': { $in: permissions } });
      if (permissionDocs.length !== permissions.length) {
        return res.status(400).json({ message: 'Some permissions not found' });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role updated successfully', role: updatedRole });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Role by ID
exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
