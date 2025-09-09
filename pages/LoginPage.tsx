
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart } from '../features/auth/authSlice';
import type { RootState } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/blog/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart({ email, password }));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Admin Login</h1>
        <p className="text-lg text-gray-400 mt-2">Access the Blog Admin panel.</p>
      </div>

      <div className="w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="password"
            />
          </div>

          {error && <ErrorDisplay message={error} />}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
