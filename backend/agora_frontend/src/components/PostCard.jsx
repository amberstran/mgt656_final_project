import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm bg-white">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{post.is_anonymous ? 'Anonymous' : post.user.display_name}</span>
        <span>{new Date(post.created_at).toLocaleString()}</span>
      </div>
      <h3 className="font-semibold mt-2">{post.title}</h3>
      <p className="mt-1">{post.content}</p>
    </div>
  );
};

export default PostCard;
