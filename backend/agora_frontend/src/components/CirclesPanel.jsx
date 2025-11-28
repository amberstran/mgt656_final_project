import React, { useEffect, useState } from 'react';
import { fetchCircles, joinCircle, leaveCircle } from '../api';
import './CirclesPanel.css';

const CirclesPanel = ({ selectedCircleId = null, onSelect = () => {} }) => {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCircles();
      const data = res.data || [];
      setCircles(data);
    } catch (err) {
      console.error('Failed to load circles', err);
      setError('Failed to load circles');
      setCircles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onJoin = async (id) => {
    try {
      await joinCircle(id);
      await load();
    } catch (err) {
      console.error('Join failed', err);
      alert('Failed to join circle');
    }
  };

  const onLeave = async (id) => {
    try {
      await leaveCircle(id);
      // If the selected circle was left, tell parent to clear selection
      if (selectedCircleId === id) onSelect(null);
      await load();
    } catch (err) {
      console.error('Leave failed', err);
      alert('Failed to leave circle');
    }
  };

  if (loading) return <div className="circles-panel">Loading circles…</div>;
  if (error) return <div className="circles-panel" style={{ color: '#c33' }}>{error}</div>;

  return (
    <div className="circles-panel">
      <div className="circles-row">
        {circles.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            role="button"
            className={`circle-pill ${selectedCircleId === c.id ? 'selected' : ''}`}
          >
            <div className="circle-name">{c.name}</div>
            <div className="circle-count">({c.member_count || 0})</div>
            <div className="circle-action">
              {c.is_member ? (
                <button className="leave-btn" onClick={(e) => { e.stopPropagation(); onLeave(c.id); }}>Leave</button>
              ) : (
                <button className="join-btn" onClick={(e) => { e.stopPropagation(); onJoin(c.id); }}>Join</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CirclesPanel;
