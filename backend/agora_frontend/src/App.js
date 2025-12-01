import React, { useState, useEffect } from 'react';
import './App.css';
import PostsList from './components/PostsList';
import Login from './components/Login';
import axios from 'axios';
import CirclesList from './components/CirclesList';
import CircleFeature from './components/CircleFeature';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [feedType, setFeedType] = useState('new');

  // Fetch CSRF token on app load
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    axios.get(`${apiUrl}/api/auth/csrf/`, { withCredentials: true })
      .then(() => {
        // CSRF cookie is now set
      })
      .catch(err => {
        console.error('Failed to get CSRF token:', err);
      });
  }, []);

  const path = window.location.pathname;
  const isCirclesPage = path.startsWith('/profile/circle');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="agora-header">
        <div className="agora-header-content">
          <div className="yale-logo-text">YALE</div>
          <h1 className="text-4xl font-bold text-white text-center drop-shadow">Agora</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a 
                href="/"
                className="px-3 py-1 text-white text-sm hover:bg-white hover:bg-opacity-20 rounded transition"
              >
                Feed
              </a>
              <a 
                href="/profile/circle"
                className="px-3 py-1 text-white text-sm hover:bg-white hover:bg-opacity-20 rounded transition"
              >
                Circles
              </a>
            </div>
            <div>
              <label className="mr-2 text-white text-sm">Sort:</label>
              <select 
                value={feedType} 
                onChange={(e) => setFeedType(e.target.value)} 
                className="border rounded p-1 text-sm"
              >
                <option value="new">New</option>
                <option value="all">All</option>
                <option value="top">Top</option>
              </select>
            </div>
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="ml-4 px-5 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
            >
              {showLogin ? '✕ Close' : '🔑 Login'}
            </button>
          </div>
        </div>
      </div>
      {showLogin && <Login onLogin={() => setShowLogin(false)} />}
      {isCirclesPage ? (
        <CircleFeature />
      ) : (
        <PostsList feedType={feedType} />
      )}
    </div>
  );
}

export default App;
