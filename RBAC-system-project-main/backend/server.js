const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true, // Include cookies if needed
}));
// Middleware to parse JSON
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
