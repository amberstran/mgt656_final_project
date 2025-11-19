import React from 'react';

export default function Landing({ onEnter }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        marginBottom: 48,
        background: 'white',
        padding: '24px 32px',
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        transform: 'skewX(-8deg)'
      }}>
        <h2 style={{
          margin: 0,
          transform: 'skewX(8deg)',
          fontSize: 24,
          letterSpacing: 1,
          color: '#0f172a',
        }}>A safe place to ask & share at Yale</h2>
      </div>

      <div style={{
        width: 120,
        height: 120,
        borderRadius: '9999px',
        background: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: 28,
        boxShadow: '0 12px 24px rgba(37, 99, 235, 0.25)'
      }}>
        A
      </div>

      <div style={{ marginTop: 16, fontSize: 28, fontWeight: 800, letterSpacing: 2, color: '#111827' }}>
        Agora
      </div>

      <button
        onClick={onEnter}
        style={{
          marginTop: 36,
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          background: '#111827',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
        }}
      >
        Enter Agora →
      </button>
    </div>
  );
}
