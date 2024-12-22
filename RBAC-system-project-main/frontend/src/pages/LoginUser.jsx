import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api'; // Ensure you import api here
import Rocket from '../assests/Rocket.jpg';


const LoginUser = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      console.log(err); // Log the full error
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div className="hero bg-white min-h-screen">
      <div className="hero-content flex lg:flex-row-reverse items-stretch gap-0 h-auto">
        <div className="card bg-slate-200 w-full max-w-sm shrink-0 shadow-2xl  rounded-r-lg">
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-5xl font-bold text-gray-700">Login</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="form-control">
              <label className="label">
                <span className="label-text  text-lg text-gray-700">Email</span>
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
                <span className="label-text text-gray-700">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="input input-bordered bg-slate-50"
                required
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary text-white text-lg bg-blue-700">
                Login
              </button>
            </div>
          </form>
          <p className="mb-6 text-center">
            Don't have an account? 
            <button 
              onClick={handleSignUpRedirect} 
              className="text-blue-500 font-semibold hover:underline ml-2">
              Sign Up
            </button>
          </p>
        </div>
        
        <div className="hidden lg:block flex-1">
          <img src={Rocket} alt="Rocket" className="h-full w-full object-cover rounded-l-lg" />
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
