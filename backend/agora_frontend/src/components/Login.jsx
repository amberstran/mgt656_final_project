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
    <div className="login-panel">
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#222' }}>Login</h2>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#999' }}>Sign in to like and comment</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', border: '2px solid #ddd', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem' }}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', border: '2px solid #ddd', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem' }}
            required
            disabled={loading}
          />
        </div>
        {error && (
          <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', background: '#667eea', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1.25rem', fontSize: '0.875rem', color: '#999', textAlign: 'center' }}>
        Or login via <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" style={{ color: '#667eea', fontWeight: '500' }}>Django Admin</a>
      </p>
    </div>
  );
};

export default Login;

