import React from 'react';

const PostModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg max-w-2xl w-full mx-4 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <div className="text-sm text-gray-500">{post.user?.display_name || 'Anonymous'} · {new Date(post.created_at).toLocaleString()}</div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Close</button>
        </div>
        <div className="mt-4 whitespace-pre-wrap">{post.content}</div>
      </div>
    </div>
  );
};

export default PostModal;
