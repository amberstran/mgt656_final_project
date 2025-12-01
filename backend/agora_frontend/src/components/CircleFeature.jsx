import React, { useState, useEffect } from 'react';
import { fetchCircles } from '../api';

// Mock data for initial development
const mockCircles = [
  { id: 1, name: 'Hiking Group', memberCount: 14, members: ['user1', 'user2', 'user3', 'me'] },
  { id: 2, name: 'School of Engineering', memberCount: 52, members: ['admin1', 'userA', 'userB'] },
  { id: 3, name: 'Tennis Club', memberCount: 8, members: ['tennis_pro', 'userX', 'userY'] },
];

const CircleFeature = () => {
  // State management
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load circles on mount
  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    setLoading(true);
    try {
      const res = await fetchCircles();
      const payload = res.data;
      const data = Array.isArray(payload) ? payload : (payload.results || payload || []);
      
      // Filter only circles the user has joined (is_member === true)
      const joinedCircles = data.filter(c => c.is_member);
      setCircles(joinedCircles);
    } catch (e) {
      console.error('Failed to load circles:', e);
      // Fallback to mock data in development
      setCircles(mockCircles);
    } finally {
      setLoading(false);
    }
  };

  const handleCircleSelect = (circle) => {
    setSelectedCircle(circle);
  };

  const handleCreateCircle = () => {
    alert('Create Circle feature coming soon!');
    // TODO: Implement create circle modal/form
  };

  return (
    <div className="circle-feature-container">
      <div className="circle-layout">
        {/* Column 1: Your Circles (Left Panel) */}
        <div className="column column-left">
          <div className="column-header">
            <h2 className="column-title">Your Circles</h2>
          </div>
          <div className="column-content">
            {loading ? (
              <div className="empty-state">Loading circles...</div>
            ) : circles.length === 0 ? (
              <div className="empty-state">
                <p>You haven't joined any circles yet.</p>
              </div>
            ) : (
              <ul className="circle-list">
                {circles.map((circle) => (
                  <li
                    key={circle.id}
                    className={`circle-item ${selectedCircle?.id === circle.id ? 'active' : ''}`}
                    onClick={() => handleCircleSelect(circle)}
                  >
                    <span className="circle-name">{circle.name}</span>
                    <span className="member-count">({circle.member_count || circle.memberCount || 0})</span>
                  </li>
                ))}
              </ul>
            )}
            <button className="create-circle-btn" onClick={handleCreateCircle}>
              + Create Circle
            </button>
          </div>
        </div>

        {/* Column 2: Circle Messages (Center Panel) */}
        <div className="column column-center">
          <div className="column-header">
            <h2 className="column-title">
              {selectedCircle ? selectedCircle.name : 'Circle Messages'}
            </h2>
          </div>
          <div className="column-content">
            {!selectedCircle ? (
              <div className="empty-state center-empty">
                <p>Select a circle to view messages</p>
              </div>
            ) : (
              <div className="messages-container">
                <div className="message-placeholder">
                  <p className="placeholder-text">Messages for {selectedCircle.name} will appear here.</p>
                  {/* TODO: Replace with actual message feed component */}
                  <div className="mock-messages">
                    <div className="message-item">
                      <strong>user1:</strong> Welcome to {selectedCircle.name}!
                    </div>
                    <div className="message-item">
                      <strong>me:</strong> Thanks for having me!
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Group Members (Right Panel) */}
        <div className="column column-right">
          <div className="column-header">
            <h2 className="column-title">
              {selectedCircle ? `# of group member` : 'Members'}
            </h2>
          </div>
          <div className="column-content">
            {!selectedCircle ? (
              <div className="empty-state">
                <p>Select a circle to view members</p>
              </div>
            ) : (
              <ul className="member-list">
                {(selectedCircle.members || ['user1', 'user2', 'user3', 'me']).map((member, idx) => (
                  <li key={idx} className="member-item">
                    <span className="member-avatar">{member.charAt(0).toUpperCase()}</span>
                    <span className="member-name">{member}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .circle-feature-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .circle-layout {
          display: grid;
          grid-template-columns: 280px 1fr 280px;
          gap: 20px;
          height: calc(100vh - 120px);
        }

        .column {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .column-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
          background: #fafafa;
        }

        .column-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .column-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        /* Column 1: Your Circles */
        .column-left .empty-state {
          color: #999;
          font-size: 14px;
          text-align: center;
          padding: 40px 20px;
        }

        .circle-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
        }

        .circle-item {
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9f9f9;
          border: 2px solid transparent;
        }

        .circle-item:hover {
          background: #f0f0f0;
        }

        .circle-item.active {
          background: #e6f0ff;
          border-color: #007aff;
        }

        .circle-name {
          font-weight: 500;
          color: #333;
        }

        .member-count {
          color: #999;
          font-size: 14px;
        }

        .create-circle-btn {
          width: 100%;
          padding: 12px;
          background: #007aff;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .create-circle-btn:hover {
          background: #0056b3;
        }

        /* Column 2: Circle Messages */
        .column-center .empty-state.center-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
          font-size: 16px;
        }

        .messages-container {
          height: 100%;
        }

        .message-placeholder {
          color: #666;
        }

        .placeholder-text {
          color: #999;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .mock-messages {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-item {
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.5;
        }

        .message-item strong {
          color: #007aff;
        }

        /* Column 3: Group Members */
        .column-right .empty-state {
          color: #999;
          font-size: 14px;
          text-align: center;
          padding: 40px 20px;
        }

        .member-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .member-item {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          margin-bottom: 8px;
          border-radius: 8px;
          background: #f9f9f9;
          transition: background 0.2s;
        }

        .member-item:hover {
          background: #f0f0f0;
        }

        .member-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #007aff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 12px;
        }

        .member-name {
          font-size: 14px;
          color: #333;
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .circle-layout {
            grid-template-columns: 1fr;
            gap: 16px;
            height: auto;
          }

          .column {
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
};

export default CircleFeature;
