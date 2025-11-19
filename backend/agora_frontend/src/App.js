import React, { useState, useEffect } from 'react';
import './App.css';
import PostsList from './components/PostsList';
import Login from './components/Login';
import Landing from './components/Landing';
import BottomNav from './components/BottomNav';
import CreatePostModal from './components/CreatePostModal';
import axios from 'axios';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [feedType, setFeedType] = useState('new');
  const [showCreate, setShowCreate] = useState(false);
  const [reloadSignal, setReloadSignal] = useState(0);

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

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="agora-header">
        <div className="agora-header-content" style={{ justifyContent: 'center' }}>
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
        </div>
      </div>
      {showLogin && <Login onLogin={() => setShowLogin(false)} />}
      <PostsList feedType={feedType} reloadSignal={reloadSignal} />
      <BottomNav
        onCreate={() => setShowCreate(true)}
        onProfile={() => { window.location.href = '/profile/'; }}
      />
      <CreatePostModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => setReloadSignal((s) => s + 1)}
      />
    </div>
  );
}

export default App;
