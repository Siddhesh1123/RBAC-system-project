import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { getUserRole } from "../context/GetUserRoles";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          Authorization:` Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
        console.log("response", response);
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
      console.log("response", response);

      if (response.ok) {
        alert(`User ${isEditing ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        fetchUsers(); // Refresh users
      } else {
        alert(`Failed to ${isEditing ? "update" : "save"} user`);
      }
    }catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white ">
      <div className="bg-slate-200 p-6 rounded-lg shadow-lg w-full m-20">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-6xl font-bold text-left text-slate-800  mb-4">
              Welcome, {auth.user.username}!
            </h1>
            <p className="text-4xl text-left text-slate-700  mb-6">
              Your Role is :{" "}
              <span className="font-semibold text-blue-500">
                {getUserRole(auth.user.role)}
              </span>
            </p>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-900 text-white px-10 py-2 text-xl rounded hover:bg-blue-800 h-14"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex flex-row items-center justify-between">
          <h2 className="text-3xl font-semibold text-slate-600  mb-3 flex justify-between">
            User List
            
          </h2>
          {getUserRole(auth.user.role) === "Admin" && (
              <button
                className="bg-green-500 text-white px-4 py-2 text-xl rounded hover:bg-green-600"
                onClick={handleAddUser}
              >
                Add User
              </button>
            )}
            </div>
          <table className="w-full table-auto border-collapse border-black mt-10 bg-slate-100">
            <thead >
              <tr className="text-gray-600 ">
                <th className="border px-4 py-2 text-2xl">Username</th>
                <th className="border px-4 py-2 text-2xl">Email</th>
                <th className="border px-4 py-2 text-2xl">Role</th>
                <th className="border px-4 py-2 text-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2 text-xl ">{user.username}</td>
                  <td className="border px-4 py-2 text-xl">{user.email}</td>
                  <td className="border px-4 py-2 text-xl">{user.role.name}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    {(getUserRole(auth.user.role) === "Admin" ||
                      getUserRole(auth.user.role) === "Editor") && (
                      <>
                        <button
                          className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-10 py-2  rounded hover:bg-red-600"
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
  );
};

export default Dashboard;
