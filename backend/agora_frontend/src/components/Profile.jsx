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
  // user preference state for posting with real name
  const [postWithRealName, setPostWithRealName] = useState(false);
  const [savingPref, setSavingPref] = useState(false);

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
        credentials: 'same-origin',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
        // set preference if available
        if (data.user && typeof data.user.post_with_real_name !== 'undefined') {
          setPostWithRealName(Boolean(data.user.post_with_real_name));
        }
      } else {
        console.warn('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const updatePostWithRealName = async (value) => {
    setSavingPref(true);
    // optimistic update
    const prev = postWithRealName;
    setPostWithRealName(Boolean(value));
    try {
      const res = await fetch('/api/profile/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ post_with_real_name: Boolean(value) }),
      });
      if (!res.ok) {
        throw new Error('Failed to save preference');
      }
      // optionally refresh data
      // const payload = await res.json();
    } catch (err) {
      console.error(err);
      // revert on failure
      setPostWithRealName(prev);
      alert('Unable to save preference. Please try again.');
    } finally {
      setSavingPref(false);
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
        {/* Real-name posting toggle */}
        <div className="bar toggle-row">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <div style={{textAlign: 'left'}}>
              <div style={{fontWeight: 700}}>Show my real name on posts</div>
              <div style={{fontSize: 12, color: '#666'}}>When enabled, your posts and comments will use your first/last name instead of Anonymous.</div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={postWithRealName} disabled={savingPref} onChange={(e) => updatePostWithRealName(e.target.checked)} />
              <span className="slider" />
            </label>
          </div>
        </div>
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
