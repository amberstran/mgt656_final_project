import React, { useState } from 'react';
import { toggleLike, deletePost, addComment } from '../api';

const PostCard = ({ post, onDelete }) => {
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Comment form state
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [replyingTo, setReplyingTo] = useState(null); // comment id
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const onLike = async () => {
    if (loading) return;
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
      console.error('Like failed', err);
      // optionally show UI feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 mb-6 shadow-md bg-white">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{post.is_anonymous ? 'Anonymous' : post.user.display_name}</span>
        <span>{new Date(post.created_at).toLocaleString()}</span>
      </div>
      <h3 className="font-semibold mt-3 mb-2 text-lg">{post.title}</h3>
      <p className="mt-2 mb-4 text-gray-700">{post.content}</p>
      <div className="mt-4 w-full flex items-center justify-center space-x-3">
        <button
          onClick={onLike}
          disabled={loading}
          className={`px-3 py-1 rounded ${liked ? 'bg-red-200' : 'bg-gray-200'}`}
        >
          {liked ? '♥' : '♡'} {likesCount}
        </button>
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
              // optionally show UI feedback
            } finally {
              setDeleting(false);
            }
          }}
          disabled={deleting}
          className="px-3 py-1 rounded bg-gray-200 text-sm"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-semibold mb-3 text-gray-800 text-center">Comments</h4>
        {comments.length === 0 && <div className="text-gray-500 text-center">No comments yet.</div>}
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded p-2 mb-2 bg-gray-50 mx-auto max-w-2xl">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{comment.is_anonymous ? 'Anonymous' : comment.user.display_name || comment.user.username}</span>
              <span>{new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <div className="mt-1">{comment.content}</div>
            <button
              className="text-blue-600 text-xs mt-1"
              onClick={() => {
                setReplyingTo(comment.id);
                setReplyText('');
              }}
            >Reply</button>
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-4 mt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="border rounded p-2 mb-1 bg-gray-100">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{reply.is_anonymous ? 'Anonymous' : reply.user.display_name || reply.user.username}</span>
                      <span>{new Date(reply.created_at).toLocaleString()}</span>
                    </div>
                    <div className="mt-1">{reply.content}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Reply form */}
            {replyingTo === comment.id && (
              <form
                className="mt-2 flex justify-center items-center"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!replyText.trim()) return;
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
                    // handle error
                  } finally {
                    setReplyLoading(false);
                  }
                }}
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="border px-2 py-1 rounded w-2/3 max-w-md"
                  placeholder="Write a reply..."
                  disabled={replyLoading}
                />
                <button type="submit" className="ml-2 px-2 py-1 bg-blue-200 rounded" disabled={replyLoading}>
                  {replyLoading ? 'Replying...' : 'Reply'}
                </button>
                <button type="button" className="ml-2 text-xs text-gray-500" onClick={() => setReplyingTo(null)}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        ))}

        {/* Add comment form */}
        <form
          className="mt-2 flex justify-center items-center"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!commentText.trim()) return;
            setCommentLoading(true);
            try {
              const res = await addComment(post.id, { content: commentText });
              setComments((prev) => [...prev, res.data]);
              setCommentText('');
            } catch (err) {
              // handle error
            } finally {
              setCommentLoading(false);
            }
          }}
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border px-2 py-1 rounded w-2/3 max-w-md"
            placeholder="Add a comment..."
            disabled={commentLoading}
          />
          <button type="submit" className="ml-2 px-2 py-1 bg-blue-200 rounded" disabled={commentLoading}>
            {commentLoading ? 'Commenting...' : 'Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
