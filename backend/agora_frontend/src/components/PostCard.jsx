import React, { useState } from 'react';
import { toggleLike, deletePost, addComment, reportPost } from '../api';

const PostCard = ({ post, onDelete, onOpen }) => {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [likeError, setLikeError] = useState('');

  // Comment form state
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [replyingTo, setReplyingTo] = useState(null); // comment id
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState('');

  const onLike = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (loading) return;
    setLikeError('');
    // optimistic update
    setLoading(true);
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await toggleLike(post.id);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      // revert on error
      setLiked(prevLiked);
      setLikesCount(prevCount);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to like post';
      setLikeError(errorMsg);
      console.error('Like failed', err);
      // Clear error after 3 seconds
      setTimeout(() => setLikeError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-card" onClick={() => onOpen && onOpen(post)} style={{ cursor: onOpen ? 'pointer' : 'default' }}>
      {/* Header: Author and Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#555' }}>
          {post.is_anonymous ? 'Anonymous' : (post.user.display_name || post.user.username)}
        </span>
        <span style={{ fontSize: '0.75rem', color: '#999' }}>
          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#222' }}>{post.title}</h3>

      {/* Content */}
      <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6', marginBottom: '1rem' }}>{post.content}</p>

      {/* Image if present */}
      {(post.image || post.image_url) && (
        <div style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
          {(() => {
            const raw = post.image || post.image_url;
            let src = raw;
            if (typeof raw === 'string' && raw.startsWith('/')) {
              const apiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');
              src = apiUrl + raw;
            }
            return (
              <img
                src={src}
                alt="Post attachment"
                style={{ maxHeight: '320px', width: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e5e5' }}
              />
            );
          })()}
        </div>
      )}

      {/* Actions: Like and Delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0' }}>
        <button
          onClick={onLike}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '0.9rem',
            border: 'none',
            background: liked ? '#fee' : '#f5f5f5',
            color: liked ? '#c33' : '#666',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '1.1rem', marginRight: '0.25rem' }}>{liked ? '♥' : '♡'}</span>
          {likesCount}
        </button>
        {likeError && (
          <div style={{ fontSize: '0.75rem', color: '#c33' }}>{likeError}</div>
        )}
        <button
          onClick={async (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            const reason = window.prompt('Why are you reporting this post? (optional)');
            if (reason === null) return; // user cancelled
            try {
              await reportPost(post.id, { reason: reason || 'No reason provided' });
              alert('Report submitted. Thank you.');
            } catch (err) {
              console.error('Report failed', err);
              const errorMsg = err.response?.data?.detail || err.message || 'Failed to submit report';
              alert(errorMsg);
            }
          }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '500',
            border: 'none',
            background: '#fff5f5',
            color: '#b33',
            cursor: 'pointer'
          }}
        >
          Report
        </button>
        <button
          onClick={async (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            if (deleting) return;
            if (!window.confirm('Delete this post?')) return;
            setDeleting(true);
            try {
              await deletePost(post.id);
              if (onDelete) onDelete(post.id);
            } catch (err) {
              console.error('Delete failed', err);
              alert('Failed to delete post. Please try again.');
            } finally {
              setDeleting(false);
            }
          }}
          disabled={deleting}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: '500',
            border: 'none',
            background: '#f5f5f5',
            color: '#666',
            cursor: deleting ? 'not-allowed' : 'pointer',
            opacity: deleting ? 0.6 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {/* Comments Section */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', color: '#333', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>💬</span>
          Comments {comments.length > 0 && <span style={{ color: '#999', fontWeight: '400', marginLeft: '0.5rem' }}>({comments.length})</span>}
        </h4>
        {comments.length === 0 && (
          <div style={{ color: '#999', textAlign: 'center', padding: '1rem', fontSize: '0.875rem', fontStyle: 'italic' }}>
            No comments yet. Be the first to comment!
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '0.75rem', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#555' }}>
                  {comment.is_anonymous ? 'Anonymous' : (comment.user.display_name || comment.user.username)}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#999' }}>
                  {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#444', lineHeight: '1.5', marginBottom: '0.5rem' }}>{comment.content}</div>
                <button
                style={{ fontSize: '0.8rem', color: '#667eea', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0' }}
                onClick={(e) => { if (e && e.stopPropagation) e.stopPropagation(); setReplyingTo(comment.id); setReplyText(''); setReplyError(''); }}
              >
                ↩️ Reply
              </button>
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.75rem', paddingLeft: '1rem', borderLeft: '2px solid #d0d0f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} style={{ background: 'white', borderRadius: '6px', padding: '0.5rem', border: '1px solid #e5e5e5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#555' }}>
                          {reply.is_anonymous ? 'Anonymous' : (reply.user.display_name || reply.user.username)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#999' }}>
                          {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#444' }}>{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Reply form */}
              {replyingTo === comment.id && (
                <form
                  style={{ marginTop: '0.75rem' }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (e && e.stopPropagation) e.stopPropagation();
                    if (!replyText.trim()) return;
                    setReplyError('');
                    setReplyLoading(true);
                    try {
                      const res = await addComment(post.id, { content: replyText, parent: comment.id });
                      setComments((prev) =>
                        prev.map((c) =>
                          c.id === comment.id
                            ? { ...c, replies: [...(c.replies || []), res.data] }
                            : c
                        )
                      );
                      setReplyText('');
                      setReplyingTo(null);
                    } catch (err) {
                      const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to post reply';
                      setReplyError(errorMsg);
                      console.error('Reply failed', err);
                    } finally {
                      setReplyLoading(false);
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      style={{ flex: 1, border: '1px solid #ddd', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}
                      placeholder="Write a reply..."
                      disabled={replyLoading}
                    />
                    <button
                      type="submit"
                      style={{ padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: replyLoading ? 'not-allowed' : 'pointer', opacity: replyLoading ? 0.6 : 1 }}
                      disabled={replyLoading}
                    >
                      {replyLoading ? 'Posting...' : 'Post'}
                    </button>
                    <button
                      type="button"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                        setReplyError('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  {replyError && (
                    <div style={{ fontSize: '0.75rem', color: '#c33', marginTop: '0.5rem', background: '#fee', padding: '0.5rem', borderRadius: '4px' }}>{replyError}</div>
                  )}
                </form>
              )}
            </div>
          ))}
        </div>

        {/* Add comment form */}
        <form
          style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0' }}
            onSubmit={async (e) => {
            e.preventDefault();
            if (e && e.stopPropagation) e.stopPropagation();
            if (!commentText.trim()) return;
            setCommentError('');
            setCommentLoading(true);
            try {
              const res = await addComment(post.id, { content: commentText });
              setComments((prev) => [...prev, res.data]);
              setCommentText('');
            } catch (err) {
              const errorMsg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to post comment';
              setCommentError(errorMsg);
              console.error('Comment failed', err);
            } finally {
              setCommentLoading(false);
            }
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ flex: 1, border: '1px solid #ddd', padding: '0.65rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
              placeholder="Add a comment..."
              disabled={commentLoading}
            />
            <button
              type="submit"
              style={{ padding: '0.65rem 1.25rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: commentLoading ? 'not-allowed' : 'pointer', opacity: commentLoading ? 0.6 : 1, transition: 'all 0.2s ease' }}
              disabled={commentLoading}
            >
              {commentLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {commentError && (
            <div style={{ fontSize: '0.75rem', color: '#c33', marginTop: '0.5rem', background: '#fee', padding: '0.5rem', borderRadius: '4px' }}>{commentError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostCard;
