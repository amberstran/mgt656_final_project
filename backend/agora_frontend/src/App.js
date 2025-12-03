import React, { useState, useEffect } from 'react';
import './App.css';
import PostsList from './components/PostsList';
import Login from './components/Login';
import Landing from './components/Landing';
import BottomNav from './components/BottomNav';
import CreatePostModal from './components/CreatePostModal';
import axios from 'axios';
import CirclesPanel from './components/CirclesPanel';
import BackButton from './components/BackButton';
import AuthDebug from './components/AuthDebug';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Profile from './components/Profile';
import UserMenu from './components/UserMenu';
import ABTest from './components/ABTest';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [feedType, setFeedType] = useState('new');
  const [showCreate, setShowCreate] = useState(false);
  const [reloadSignal, setReloadSignal] = useState(0);
  const [selectedCircle, setSelectedCircle] = useState(null);

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

  // Redirect A/B test deep link to backend endpoint to avoid frontend 404s
  if (location.pathname === '/1317cca') {
    window.location.href = 'https://agora-backend-vavf.onrender.com/1317cca/';
    return null;
  }

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  // While checking auth, show a minimal loading state
  if (!authChecked) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={
          <>
            <div className="agora-header">
              <div className="agora-header-content" style={{ justifyContent: 'center' }}>
                <div style={{ position: 'absolute', left: '1rem' }}>
                  <BackButton />
                </div>
                <div className="yale-logo-text">YALE</div>
                <h1 className="text-4xl font-bold text-white text-center drop-shadow" style={{ margin: '0 2rem' }}>Agora</h1>
                <div className="bg-white/20 rounded-lg p-1 flex text-white text-sm">
                  {['new','top'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFeedType(t)}
                      className={`px-3 py-1 rounded-md transition-colors ${feedType === t ? 'bg-white text-blue-700' : 'text-white/90 hover:bg-white/10'}`}
                    >
                      {t === 'new' ? 'Latest' : 'Hot'}
                    </button>
                  ))}
                </div>
                {isAuthed && currentUser && (
                  <div style={{ position: 'absolute', right: '1rem' }}>
                    <UserMenu 
                      username={currentUser.username} 
                      onLogout={() => {
                        setIsAuthed(false);
                        setCurrentUser(null);
                        setShowLogin(true);
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>
            {showLogin && !isAuthed && (
              <div style={{ maxWidth: 440, margin: '1rem auto' }}>
                <Login onLogin={() => {
                  // After login, re-check auth
                  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
                  axios.get(`${apiUrl}/api/auth/me/`, { withCredentials: true })
                    .then(r => {
                      if (r.data?.authenticated) {
                        setIsAuthed(true);
                        setShowLogin(false);
                      }
                    });
                }} />
                <p style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.875rem', 
                  color: '#666', 
                  textAlign: 'center' 
                }}>
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    style={{ 
                      color: '#667eea', 
                      fontWeight: '600', 
                      textDecoration: 'none' 
                    }}
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            )}
            <CirclesPanel selectedCircleId={selectedCircle} onSelect={setSelectedCircle} />
            <PostsList feedType={feedType} reloadSignal={reloadSignal} circleId={selectedCircle} />
            <BottomNav
              onCreate={() => setShowCreate(true)}
              onProfile={() => navigate('/profile')}
            />
            <CreatePostModal
              open={showCreate}
              onClose={() => setShowCreate(false)}
              onCreated={() => setReloadSignal((s) => s + 1)}
            />
            <AuthDebug />
          </>
        } />
      </Routes>
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
