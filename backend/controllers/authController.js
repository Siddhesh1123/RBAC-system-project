const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const mongoose = require('mongoose');

// Create User (Signup)
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if all fields are provided
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the role exists
    const userRole = await Role.findById(role);
    
    console.log(userRole); 
    if (!userRole) {
      return res.status(400).json({ message: 'Role not found' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword, role });

    // Save the user to the database
    await newUser.save();

    // Create JWT token for the new user
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: userRole.name },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token: token,  // Send JWT token back with the response
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: userRole.name,
        status: newUser.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User Login
// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log stored password hash and input password
    console.log('Stored password hash:', user.password);  // Log stored hash
    console.log('Input password:', password);  // Log input password

    // Check if the input password matches the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If the password doesn't match
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and assign a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Send response with JWT token and user info
    res.status(200).json({
      message: 'Login successful',
      token: token,  // Send JWT token back with the response
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

