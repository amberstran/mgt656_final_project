import React, { useState } from 'react';
import { toggleLike, deletePost, addComment } from '../api';

const PostCard = ({ post, onDelete }) => {
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

  const onLike = async () => {
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
    <div className="border border-gray-200 rounded-lg p-6 mb-6 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
        <span className="font-medium">{post.is_anonymous ? 'Anonymous' : (post.user.display_name || post.user.username)}</span>
        <span className="text-gray-500">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <h3 className="font-bold text-xl mb-2 text-gray-900">{post.title}</h3>
      <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
      <div className="mt-4 flex items-center space-x-4 pb-4 border-b border-gray-100">
        <div>
          <button
            onClick={onLike}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              liked 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-lg mr-1">{liked ? '♥' : '♡'}</span>
            <span>{likesCount}</span>
          </button>
          {likeError && (
            <div className="text-xs text-red-600 mt-1 animate-pulse">{likeError}</div>
          )}
        </div>
        <button
          onClick={async () => {
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
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h4 className="font-semibold mb-4 text-gray-800 flex items-center">
          <span className="mr-2">💬</span>
          Comments {comments.length > 0 && <span className="text-gray-500 font-normal ml-2">({comments.length})</span>}
        </h4>
        {comments.length === 0 && (
          <div className="text-gray-500 text-center py-4 italic">No comments yet. Be the first to comment!</div>
        )}
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {comment.is_anonymous ? 'Anonymous' : (comment.user.display_name || comment.user.username)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-gray-800 mb-3 leading-relaxed">{comment.content}</div>
              <button
                className="text-blue-600 text-sm mt-1 hover:text-blue-800 font-medium transition-colors duration-150 flex items-center"
                onClick={() => {
                  setReplyingTo(comment.id);
                  setReplyText('');
                  setReplyError('');
                }}
              >
                <span className="mr-1">↩️</span> Reply
              </button>
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-3 space-y-2 border-l-2 border-blue-200 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded p-3 border border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {reply.is_anonymous ? 'Anonymous' : (reply.user.display_name || reply.user.username)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-800">{reply.content}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Reply form */}
              {replyingTo === comment.id && (
                <form
                  className="mt-3 animate-fadeIn"
                  onSubmit={async (e) => {
                    e.preventDefault();
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
                  <div className="flex items-start gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="border border-gray-300 px-3 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Write a reply..."
                      disabled={replyLoading}
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed shadow-sm hover:shadow" 
                      disabled={replyLoading}
                    >
                      {replyLoading ? 'Posting...' : 'Post'}
                    </button>
                    <button 
                      type="button" 
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" 
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
                    <div className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded animate-pulse">{replyError}</div>
                  )}
                </form>
              )}
            </div>
          ))}
        </div>

        {/* Add comment form */}
        <form
          className="mt-4 pt-4 border-t border-gray-200"
          onSubmit={async (e) => {
            e.preventDefault();
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
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Add a comment..."
              disabled={commentLoading}
            />
            <button 
              type="submit" 
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium transition-all duration-200 shadow-sm hover:shadow disabled:cursor-not-allowed" 
              disabled={commentLoading}
            >
              {commentLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {commentError && (
            <div className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded animate-pulse">{commentError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostCard;
