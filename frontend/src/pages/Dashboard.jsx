import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);  // State to hold the list of users
  const [roles, setRoles] = useState([]);  // State to hold roles
  const [permissions, setPermissions] = useState([]); // State to hold permissions

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        console.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
      } else {
        console.error('Failed to fetch permissions');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getRoleName = (roleId) => {
    const role = roles.find((role) => role._id === roleId);
    return role ? role.name : 'Unknown';
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome, {auth.user.username}!</h1>
        <p className="text-center text-gray-600 mb-6">Role: <span className="font-semibold text-blue-500">{auth.user.role}</span></p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">User List</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{getRoleName(user.role)}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    {/* Admin can edit or delete */}
                    {auth.user.role === 'Admin' && (
                      <>
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                      </>
                    )}
                    {/* Editor can update */}
                    {auth.user.role === 'Editor' && (
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Update</button>
                    )}
                    {/* Viewer can only view */}
                    {auth.user.role === 'Viewer' && (
                      <button className="bg-gray-500 text-white px-2 py-1 rounded cursor-not-allowed">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
