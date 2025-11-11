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

  if (loading) return <div className="text-center py-8 text-gray-600">Loading posts…</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {JSON.stringify(error)}</div>;
  if (!posts.length) return <div className="text-center py-8 text-gray-600">No posts to show.</div>;

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-3xl mx-auto pl-12 pr-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default PostsList;
