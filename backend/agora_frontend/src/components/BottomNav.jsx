import React from 'react';

const BottomNav = ({ onCreate, onProfile }) => {
  return (
    <nav className="bottom-nav">
      <button
        aria-label="Posts feed"
        onClick={() => window.location.reload()}
        style={{ fontSize: '1.75rem' }}
      >
        📝
      </button>
      <button
        aria-label="Create post"
        onClick={onCreate}
        style={{
          fontSize: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          marginTop: '-1.5rem',
          border: '3px solid white',
        }}
      >
        ➕
      </button>
      <button
        aria-label="Personal profile"
        onClick={() => window.location.href = 'http://127.0.0.1:8000/profile/'}
        style={{ fontSize: '1.75rem' }}
      >
        👤
      </button>
    </nav>
  );
};

export default BottomNav;
