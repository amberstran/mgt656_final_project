import React from 'react';

const PostCard = ({ post, onClick }) => {
  return (
    <button
      onClick={() => onClick && onClick(post)}
      className="w-full text-left border rounded-md p-4 mb-4 shadow-sm bg-white hover:shadow-md focus:outline-none"
    >
      <div className="flex justify-between text-sm text-gray-500">
        <span>{post.is_anonymous ? 'Anonymous' : post.user?.display_name}</span>
        <span>{new Date(post.created_at).toLocaleString()}</span>
      </div>
      <h3 className="font-semibold mt-2">{post.title}</h3>
      <p className="mt-1">{post.content}</p>
    </button>
  );
};

export default PostCard;
