import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { fetchPosts } from '../api';

const PostsList = ({ feedType = 'all' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPosts(feedType);
        // axios returns { data: ... }
        if (!mounted) return;
        setPosts(res.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data || err.message || 'Failed to load posts');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [feedType]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white shadow-md animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">⚠️ Error loading posts</div>
          <div className="text-red-500 text-sm">{typeof error === 'string' ? error : 'Failed to load posts. Please refresh the page.'}</div>
        </div>
      </div>
    );
  }
  
  if (!posts.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <div className="text-gray-600 text-lg font-medium">No posts to show</div>
        <div className="text-gray-500 text-sm mt-2">Be the first to create a post!</div>
      </div>
    );
  }

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default PostsList;
