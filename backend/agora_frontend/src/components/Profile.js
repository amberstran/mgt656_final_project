import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'messages'

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  useEffect(() => {
    loadUserData();
    loadPosts();
    loadCircles();
  }, []);

  useEffect(() => {
    if (selectedCircle) {
      loadMessages(selectedCircle.id);
    }
  }, [selectedCircle]);

  const loadUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me/`, { withCredentials: true });
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      // Get user's own posts
      const response = await axios.get(`${API_URL}/api/posts/?feed=new&page_size=100`, { withCredentials: true });
      // Filter to only show current user's posts
      const myPosts = response.data.results?.filter(post => post.user === user?.id) || [];
      setPosts(myPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCircles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/circles/`, { withCredentials: true });
      setCircles(response.data || []);
    } catch (error) {
      console.error('Failed to load circles:', error);
      setCircles([]);
    }
  };

  const loadMessages = async (circleId) => {
    try {
      // Since there's no explicit messages API endpoint visible, we'll need to check
      // For now, set empty messages
      setMessages([]);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCircle) return;

    try {
      // This endpoint might need to be created
      await axios.post(`${API_URL}/api/circles/${selectedCircle.id}/messages/`, {
        content: newMessage,
        is_anonymous: false
      }, { withCredentials: true });
      
      setNewMessage('');
      loadMessages(selectedCircle.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. This feature may need backend implementation.');
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/posts/${postId}/`, { withCredentials: true });
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-info">
          {user?.avatar && <img src={user.avatar} alt="Avatar" className="profile-avatar" />}
          <div>
            <h1>{user?.display_name || user?.username || 'User'}</h1>
            <p className="profile-netid">@{user?.username}</p>
            {user?.program && <p className="profile-detail">📚 {user.program}</p>}
            {user?.grade && <p className="profile-detail">🎓 {user.grade}</p>}
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          My Posts ({posts.length})
        </button>
        <button 
          className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Circle Messages
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            {posts.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any posts yet.</p>
                <button onClick={() => window.location.href = '/'}>Create your first post</button>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map(post => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <button 
                        className="delete-btn"
                        onClick={() => deletePost(post.id)}
                        title="Delete post"
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="post-content">{post.content}</p>
                    {post.image && <img src={post.image} alt="Post" className="post-image" />}
                    <div className="post-meta">
                      <span>👍 {post.like_count || 0} likes</span>
                      <span>💬 {post.comment_count || 0} comments</span>
                      <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <div className="messages-layout">
              {/* Circles List */}
              <div className="circles-sidebar">
                <h3>Your Circles</h3>
                {circles.length === 0 ? (
                  <p className="empty-circles">You haven't joined any circles yet.</p>
                ) : (
                  <div className="circles-list">
                    {circles.map(circle => (
                      <div 
                        key={circle.id}
                        className={`circle-item ${selectedCircle?.id === circle.id ? 'active' : ''}`}
                        onClick={() => setSelectedCircle(circle)}
                      >
                        <div className="circle-name">{circle.name}</div>
                        {circle.description && (
                          <div className="circle-desc">{circle.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div className="messages-area">
                {selectedCircle ? (
                  <>
                    <div className="messages-header">
                      <h3>{selectedCircle.name}</h3>
                      <p>{selectedCircle.description}</p>
                    </div>
                    
                    <div className="messages-list">
                      {messages.length === 0 ? (
                        <div className="empty-messages">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map(msg => (
                          <div key={msg.id} className={`message ${msg.user === user?.id ? 'own' : ''}`}>
                            <div className="message-author">
                              {msg.is_anonymous ? 'Anonymous' : msg.username}
                            </div>
                            <div className="message-content">{msg.content}</div>
                            <div className="message-time">
                              {new Date(msg.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <form className="message-form" onSubmit={sendMessage}>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                      />
                      <button type="submit" className="send-btn">Send</button>
                    </form>
                  </>
                ) : (
                  <div className="no-circle-selected">
                    <p>Select a circle to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
