const User = require('../models/User');
const Role = require('../models/Role');
const multiavatar = require('@multiavatar/multiavatar')
const bcrypt = require("bcrypt");


// Create User
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log("0")
  try {
    // Check if the role exists
    const userRole = await Role.findById(role);
    if (!userRole) {
      return res.status(400).json({ message: 'Role not found' });
    }
    console.log("1")
    const avatar = multiavatar(username);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    console.log(avatar)
    const newUser = new User({ username, email, password : hashedPassword, role, avatar });
    console.log("2")
    console.log(newUser)
    await newUser.save();
    console.log("3")
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch users: ${err.message}` });
  }
};

// Get User by ID
exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update User by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    // Check if the role exists
    const userRole = await Role.findById(role);
    if (!userRole) {
      return res.status(400).json({ message: 'Role not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, password, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete User by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
