import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Simple debug panel to display auth/session status and CSRF cookie.
// Helps diagnose issues where like/comment endpoints return 401/403.
export default function AuthDebug() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hostMismatch, setHostMismatch] = useState(false);

  useEffect(() => {
    const apiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    const appHost = window.location.host; // e.g. localhost:3000
    try {
      const backendHost = apiUrl.split('//')[1];
      if (backendHost && backendHost.split(':')[0] !== appHost.split(':')[0]) {
        setHostMismatch(true);
      }
    } catch (_) {}

    axios.get(`${apiUrl}/api/auth/me/`, { withCredentials: true })
      .then(r => setData(r.data))
      .catch(err => setError(err.response?.data || { detail: err.message }))
      .finally(() => setLoading(false));
  }, []);

  const sessionCookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('sessionid='));
  const csrfCookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('csrftoken='));

  return (
    <div style={{
      position: 'fixed', bottom: 10, right: 10, background: 'rgba(0,0,0,0.75)', color: 'white',
      padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.75rem', maxWidth: '280px', zIndex: 9999
    }}>
      <div style={{ fontWeight: '600', marginBottom: '0.35rem' }}>Auth Debug</div>
      {loading && <div>Loading...</div>}
      {!loading && error && <div style={{ color: '#f88' }}>Error: {error.detail || 'Unknown'}</div>}
      {!loading && data && (
        <>
          <div>Status: {data.authenticated ? 'Authenticated ✅' : 'Anonymous ❌'}</div>
          {data.user && <div>User: {data.user.username} (id {data.user.id})</div>}
        </>
      )}
      <div style={{ marginTop: '0.35rem' }}>sessionid: {sessionCookie ? 'Present' : 'Missing'}</div>
      <div>csrftoken: {csrfCookie ? 'Present' : 'Missing'}</div>
      {hostMismatch && (
        <div style={{ marginTop: '0.35rem', color: '#ffdd55' }}>Host mismatch: frontend and backend hosts differ; cookies may not attach.</div>
      )}
      <div style={{ marginTop: '0.35rem', opacity: 0.7 }}>Remove this component in production.</div>
    </div>
  );
}