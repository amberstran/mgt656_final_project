import React from 'react';

// Reusable back button for navigation to previous history entry.
// Falls back to homepage if no history length.
export default function BackButton({ label = 'Back', className = '' }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`back-btn ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: '#f5f5f5',
        border: '1px solid #ddd',
        padding: '0.45rem 0.9rem',
        borderRadius: '6px',
        fontSize: '0.85rem',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span>
      <span>{label}</span>
    </button>
  );
}