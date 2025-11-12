import React, { useState, useEffect } from 'react';
import './App.css';
import PostsList from './components/PostsList';
import Login from './components/Login';
import axios from 'axios';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  // Fetch CSRF token on app load
  useEffect(() => {
    axios.get('http://localhost:8000/api/auth/csrf/', { withCredentials: true })
      .then(() => {
        // CSRF cookie is now set
      })
      .catch(err => {
        console.error('Failed to get CSRF token:', err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="agora-header">
        <div className="agora-header-content">
          <div className="yale-logo-text">YALE</div>
          <h1 className="text-4xl font-bold text-white text-center drop-shadow">Agora</h1>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="ml-4 px-5 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
          >
            {showLogin ? '✕ Close' : '🔑 Login'}
          </button>
        </div>
      </div>
      {showLogin && <Login onLogin={() => setShowLogin(false)} />}
      <PostsList />
    </div>
  );
}

export default App;
