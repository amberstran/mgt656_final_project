import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import PostsList from './components/PostsList';
import Login from './components/Login';
import CircleFeature from './components/CircleFeature';
import axios from 'axios';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [feedType, setFeedType] = useState('new');
  const [selectedCircle, setSelectedCircle] = useState(null);

  const isCirclePage = location.pathname === '/profile/circle';

  // Initial auth + CSRF bootstrap
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    // Ensure CSRF cookie exists (fire-and-forget)
    axios.get(`${apiUrl}/api/auth/csrf/`, { withCredentials: true }).catch(() => {});
    // Check auth status
    axios.get(`${apiUrl}/api/auth/me/`, { withCredentials: true })
      .then(r => {
        if (r.data?.authenticated) {
          setIsAuthed(true);
          setCurrentUser(r.data.user);
          setShowLogin(false);
        } else {
          setIsAuthed(false);
          setCurrentUser(null);
          setShowLogin(true); // auto prompt login
        }
      })
      .catch(err => {
        console.warn('Auth check failed:', err);
        setShowLogin(true);
      })
      .finally(() => setAuthChecked(true));
  }, []);

  if (isCirclePage) {
    return <CircleFeature />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="agora-header">
        <div className="agora-header-content">
          <div className="yale-logo-text">YALE</div>
          <h1 className="text-4xl font-bold text-white text-center drop-shadow">Agora</h1>
          <div className="flex items-center gap-4">
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
              onClick={() => navigate('/profile/circle')}
              className="ml-4 px-5 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow transform hover:scale-105 active:scale-95"
            >
              Circles
            </button>
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
      <PostsList feedType={feedType} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
