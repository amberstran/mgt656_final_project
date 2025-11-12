import React, { useState } from 'react';
import { loginUser } from '../api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser({ username, password });
      if (onLogin) onLogin();
      // Reload page to refresh session
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 mb-8 p-8 bg-white rounded-xl shadow-lg border border-gray-200 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🔐</div>
        <h2 className="text-3xl font-bold text-gray-800">Login</h2>
        <p className="text-gray-500 text-sm mt-2">Sign in to like and comment</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
            disabled={loading}
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm animate-pulse">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span> Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <p className="mt-6 text-sm text-gray-600 text-center">
        Or login via <a href="http://localhost:8000/admin/" target="_blank" className="text-blue-600 hover:text-blue-800 font-medium underline">Django Admin</a>
      </p>
    </div>
  );
};

export default Login;

