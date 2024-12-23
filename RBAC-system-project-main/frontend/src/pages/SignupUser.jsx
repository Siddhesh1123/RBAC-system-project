import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Signupimg from "../assests/Signupimg.jpg";
import Signuoanimation from "../assests/Signupanimation.json";
import Lottie from "lottie-react";

const SignupUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const roleOptions = [
    { name: "Admin", id: "67447ddd870d4b2714192657" },
    { name: "Editor", id: "67447ddd870d4b2714192658" },
    { name: "Viewer", id: "67447ddd870d4b2714192659" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = e.target.value;
    setFormData({ ...formData, role: selectedRoleId });
  };
  const handleLoginRedirect = () => {
    navigate('/'); // Redirect to the signup page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/signup", formData);
      alert(response.data.message);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="hero bg-white min-h-screen">
      <div className="hero-content flex lg:flex-row items-stretch gap-0">
        {/* Form Section */}
        <div className="card bg-slate-200 w-full max-w-sm shrink-0 shadow-2xl rounded-r-2xl lg:rounded-r-none"> 
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-5xl font-bold text-gray-700">Sign Up</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg text-gray-700">Username</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="input input-bordered text-lg bg-slate-50"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg text-gray-700">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="input input-bordered text-lg bg-slate-50"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg text-gray-700">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="input input-bordered text-lg bg-slate-50"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg text-gray-700">Role</span>
              </label>
              <select
                name="role"
                onChange={handleRoleChange}
                className="select select-bordered text-lg bg-slate-50"
                required
              >
                <option value="">Select Role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary text-white text-lg bg-blue-700">
                Sign Up
              </button>
            </div>
            <p className="mb-6 text-center">
            Already have an account? 
            <button 
              onClick={handleLoginRedirect} 
              className="text-blue-500 font-semibold hover:underline ml-2">
              Login
            </button>
          </p>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block flex-1  bg-cover bg-center rounded-r-lg">
          <img
            src={Signupimg}
            alt="Signup Illustration"
            className="h-full w-full object-cover rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupUser;
