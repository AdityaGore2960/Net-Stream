import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const res = await register({ username, email, password });
    if (res.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(res.message || 'Failed to register');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-ns-black overflow-hidden">
      {/* Background Image (Netflix-style) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop" 
          alt="background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-ns-black via-black/40 to-black/80"></div>
      </div>

      {/* Header Logo */}
      <div className="absolute top-0 left-0 p-6 md:px-12 z-20">
        <Link to="/" className="text-ns-red text-3xl md:text-4xl font-bold tracking-tight select-none">
          NETSTREAM
        </Link>
      </div>

      {/* Register Form */}
      <div className="relative z-10 bg-black/75 p-8 md:p-16 rounded-xl w-full max-w-md backdrop-blur-sm border border-white/10 mt-12">
        <h1 className="text-3xl font-bold text-white mb-8">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              className="w-full bg-ns-dark-3 text-white px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-white transition-all peer pt-6 pb-2"
              required
            />
            <label className="absolute left-4 top-2 text-ns-gray-1 text-xs transition-all pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2">
              Username
            </label>
          </div>

          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="w-full bg-ns-dark-3 text-white px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-white transition-all peer pt-6 pb-2"
              required
            />
            <label className="absolute left-4 top-2 text-ns-gray-1 text-xs transition-all pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2">
              Email address
            </label>
          </div>

          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="w-full bg-ns-dark-3 text-white px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-white transition-all peer pt-6 pb-2"
              required
            />
            <label className="absolute left-4 top-2 text-ns-gray-1 text-xs transition-all pointer-events-none peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2">
              Password
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-ns-red text-white font-bold py-3.5 rounded mt-4 hover:bg-ns-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-16 text-ns-gray-1 text-sm">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline font-medium">
              Sign in now
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
