import React, { useState } from 'react';
import { logoutUser } from '../api';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ username, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      if (onLogout) onLogout();
      // Redirect to home and reload to clear auth state
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  const handleProfile = () => {
    setShowMenu(false);
    navigate('/profile');
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '2px solid white',
          borderRadius: '50%',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        aria-label="User menu"
      >
        {username ? username.charAt(0).toUpperCase() : '?'}
      </button>

      {showMenu && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            onClick={() => setShowMenu(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
          
          {/* Dropdown menu */}
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              right: 0,
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '200px',
              zIndex: 1000,
              overflow: 'hidden',
            }}
          >
            {/* User info */}
            <div
              style={{
                padding: '1rem',
                borderBottom: '1px solid #eee',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                {username}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.25rem' }}>
                Signed in
              </div>
            </div>

            {/* Menu items */}
            <button
              onClick={handleProfile}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              <span>👤</span>
              <span>My Profile</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'white',
                textAlign: 'left',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: loading ? '#999' : '#dc2626',
                fontWeight: '500',
                transition: 'background 0.2s',
                borderTop: '1px solid #eee',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = 'white';
              }}
            >
              <span>🚪</span>
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
