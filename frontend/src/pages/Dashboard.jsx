import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { getUserRole } from "../context/GetUserRoles";
import Dashbaordanimation from "../assests/Dashani.json";
import Rocket from "../assests/Rocketanimation.json";
import Lottie from "lottie-react";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [isEditing, setIsEditing] = useState(false); // Track whether it's an edit or add operation
  const [currentUserId, setCurrentUserId] = useState(null); // Track the current user to edit
  const [isLoading, setIsLoading] = useState(true);  // Added loading state
  const [isDataLoaded, setIsDataLoaded] = useState(false);  // Track if data is loaded

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          Authorization: ` Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setIsLoading(false); // Stop loading once data is fetched
        setIsDataLoaded(true);  // Set data as loaded
      } else {
        console.error("Failed to fetch users");
        setIsLoading(false); // Stop loading on error
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false); // Stop loading on error
    }
  };

  const handleLogout = () => logout();

  const handleAddUser = () => {
    setIsModalOpen(true);
    setIsEditing(false); // It's an add user operation
    setFormData({ username: "", email: "", password: "", role: "" });
  };

  const handleEditUser = (user) => {
    setIsModalOpen(true);
    setIsEditing(true); // It's an edit user operation
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password, // Optional: Do not pre-fill password during editing
      role: user.role._id,
    });
    setCurrentUserId(user._id); // Store the current user's ID to send in the update request
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          ` http://localhost:5000/api/users/${userId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );
        if (response.ok) {
          alert("User deleted successfully");
          fetchUsers(); // Refresh users
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `http://localhost:5000/api/users/${currentUserId}`
        : "http://localhost:5000/api/users";
      const method = isEditing ? "PUT" : "POST"; // Use PUT for edit, POST for add

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`User ${isEditing ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        fetchUsers(); // Refresh users
      } else {
        alert(`Failed to ${isEditing ? "update" : "save"} user`);
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col bg-white p-4 relative">
      {isLoading && (
        <div className="w-full h-screen absolute top-0 left-0 flex justify-center items-center bg-gray-200 bg-opacity-50 z-10">
          <Lottie animationData={Dashbaordanimation} loop={true} />
        </div>
      )}
      
      {!isLoading && isDataLoaded && (
        <div>
          <div className="mt-0 md:mt-14 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6 border-b-4 border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-700 mb-2">
                Welcome, {auth.user.username}!
              </h1>
              <p className="text-xl md:text-2xl lg:text-4xl text-gray-500">
                Your Role is:{" "}
                <span className="font-semibold text-blue-500">
                  {getUserRole(auth.user.role)}
                </span>
              </p>
            </div>
            <div>
              <button
                className="bg-orange-400 text-white text-xl px-10 py-2 rounded hover:bg-orange-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Hero Section */}
          <div className="mt-0 md:mt-14 hero flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0 lg:space-x-8 mb-12">
            <div className="w-full lg:w-1/2">
              <Lottie animationData={Dashbaordanimation} />
            </div>
            <div className="w-full lg:w-1/2">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-700 mb-4">
                Role-Based Access Control
              </h1>
              <p className="text-xl lg:text-2xl text-gray-500">
                Manage users, permission, and role seamlessly, ensuring secure
                access for every role in your system.
              </p>
            </div>
          </div>

          <div className="w-full bg-white p-4 md:p-10 rounded-lg">
            <div className="flex flex-col md:flex-row items-left md:items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4 md:mb-0">
                User List
              </h2>
              {getUserRole(auth.user.role) === "Admin" && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-xl"
                  onClick={handleAddUser}
                >
                  Add User
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 ">
                    <th className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800">Username</th>
                    <th className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800">Email</th>
                    <th className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800">Role</th>
                    <th className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800 text-center ">{user.username}</td>
                      <td className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800 text-center">{user.email}</td>
                      <td className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800 text-center">{user.role.name}</td>
                      <td className="px-2 md:px-4 py-2 text-sm md:text-xl text-gray-800 text-center space-x-2">
                        {getUserRole(auth.user.role) === "Admin" && (
                          <>
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-xl"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-xl"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-200 p-6 rounded shadow-lg w-96">
              <h2 className="text-xl text-slate-700 font-bold mb-4">
                {isEditing ? "Edit User" : "Add User"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-black">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    className="w-full bg-slate-800 px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-slate-800 px-3 py-2 border rounded"
                    required
                  />
                </div>
                  <div className="mb-4">
                    <label className="block text-black">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full bg-slate-800 px-3 py-2 border rounded"
                      required
                    />
                  </div>
                <div className="mb-4">
                  <label className="block text-black">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full bg-slate-800 px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="67447ddd870d4b2714192657">Admin</option>
                    <option value="67447ddd870d4b2714192658">Editor</option>
                    <option value="67447ddd870d4b2714192659">Viewer</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
