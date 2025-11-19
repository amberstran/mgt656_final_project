import React, { useState, useEffect } from 'react';
import './Profile.css';

/**
 * Profile Component
 * Displays user profile with stats, tabs, and navigation options
 */
function Profile() {
  const [stats, setStats] = useState({
    posts: 3,
    likes: 12,
    score: 8,
  });

  const [activeTab, setActiveTab] = useState('messages');

  const tabs = [
    { id: 'messages', label: 'Messages' },
    { id: 'notifications', label: 'Notification' },
  ];

  const barItems = [
    { id: 'my-posts', label: 'My posts', path: '/posts' },
    { id: 'my-comments', label: 'My comments', path: '/comments' },
    { id: 'agora-sparks', label: 'Agora Sparks', path: '/sparks' },
    {
      id: 'netid-verification',
      label: 'NetID Verification',
      url: '/email-verify/',
      external: false,
    },
  ];

  useEffect(() => {
    // Fetch profile data from API
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
      } else {
        console.warn('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleBarClick = (item) => {
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate using client-side routing or window.location
      window.location.href = item.path;
    }
  };

  return (
    <div className="profile-container">
      {/* Avatar */}
      <div className="avatar"></div>

      {/* Stats */}
      <div className="stats">
        <div className="stats-item">
          Posts
          <strong>{stats.posts}</strong>
        </div>
        <div className="stats-item">
          Likes
          <strong>{stats.likes}</strong>
        </div>
        <div className="stats-item">
          Agora Sparks
          <strong>{stats.score}</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Bar List */}
      <div className="bar-list">
        {barItems.map((item) => (
          <div
            key={item.id}
            className="bar"
            onClick={() => handleBarClick(item)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleBarClick(item);
              }
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
