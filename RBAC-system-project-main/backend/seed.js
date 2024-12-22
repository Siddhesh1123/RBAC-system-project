const mongoose = require('mongoose');
const Permission = require('./models/Permission');
const Role = require('./models/Role');
const dotenv = require('dotenv');

dotenv.config();

const seedRolesAndPermissions = async () => {
  try {
    // Permission data
    const permissions = [
      { name: 'user:create', description: 'Allows creating users' },
      { name: 'user:read', description: 'Allows reading user details' },
      { name: 'user:update', description: 'Allows updating user details' },
      { name: 'user:delete', description: 'Allows deleting a user' },
      { name: 'role:create', description: 'Allows creating roles' },
      { name: 'role:read', description: 'Allows reading role details' },
      { name: 'role:update', description: 'Allows updating roles' },
      { name: 'permission:create', description: 'Allows creating permissions' }, // Permission to be checked
      { name: 'permission:read', description: 'Allows reading permissions' } // New permission added
    ];

    // Check if the permissions already exist in the database
    const existingPermissions = await Permission.find({ name: { $in: permissions.map(perm => perm.name) } });
    const existingNames = existingPermissions.map(perm => perm.name);

    // Filter out the permissions that are already in the database
    const newPermissions = permissions.filter(perm => !existingNames.includes(perm.name));

    // Insert only the missing permissions
    const createdPermissions = newPermissions.length > 0 ? await Permission.insertMany(newPermissions) : [];

    // Combine existing permissions with newly inserted permissions
    const allPermissions = [...existingPermissions, ...createdPermissions];

    // Role data
    const roles = [
      {
        name: 'Admin',
        permissions: allPermissions.map((perm) => perm._id), // All permissions including 'permission:create'
      },
      {
        name: 'Editor',
        permissions: allPermissions
          .filter((perm) => !['user:delete', 'role:create'].includes(perm.name))
          .map((perm) => perm._id),
      },
      {
        name: 'Viewer',
        permissions: allPermissions
          .filter((perm) => perm.name === 'user:read')
          .map((perm) => perm._id),
      },
    ];

    // Check if roles already exist and insert only missing roles
    for (const role of roles) {
      const existingRole = await Role.findOne({ name: role.name });
      if (!existingRole) {
        // If the role doesn't exist, insert it
        await Role.create(role);
        console.log(`Role ${role.name} inserted successfully`);
      } else {
        console.log(`Role ${role.name} already exists, skipping insertion`);
      }
    }

    console.log('Roles and permissions seeded successfully');
  } catch (err) {
    console.error('Error seeding roles and permissions:', err.message);
  } finally {
    mongoose.connection.close(); // Close the connection after seeding
  }
};

// Connect to MongoDB and then run seeding
const startSeeding = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log('Connected to MongoDB successfully');
    await seedRolesAndPermissions();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
};

startSeeding();
