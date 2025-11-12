import React, { useEffect, useRef, useState, useCallback } from 'react';
import PostCard from './PostCard';
import PostModal from './PostModal';
import { fetchPosts } from '../api';

const PostsList = ({ feedType = 'new', pageSize = 10 }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const observerRef = useRef();
  const observerInstanceRef = useRef(null);
  // simple lock to prevent multiple simultaneous fetches/increments
  const isFetchingRef = useRef(false);

  const loadPage = useCallback(async (p) => {
    // mark fetching so observer won't trigger another increment
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
  const res = await fetchPosts(feedType, p, pageSize);
  const payload = res.data;
  // support DRF pagination (payload.results) or plain array
  const data = Array.isArray(payload) ? payload : (payload.results || []);
  if (p === 1) setPosts(data);
  else setPosts((prev) => [...prev, ...data]);
  const nextExists = !Array.isArray(payload) && !!payload.next;
  setHasMore(nextExists || data.length === pageSize);
    } catch (err) {
      // If the server returns 404 (no such page) stop attempting further pages
      if (err.response && err.response.status === 404) {
        setHasMore(false);
      }
      setError(err.response?.data || err.message || 'Failed to load posts');
    } finally {
      // release fetching lock after load completes
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [feedType, pageSize]);

  useEffect(() => {
    // reset when feedType changes
    setPage(1);
    setHasMore(true);
    setPosts([]);
    loadPage(1);
  }, [feedType, loadPage]);

  useEffect(() => {
    if (!observerRef.current) return;
    const el = observerRef.current;
    // disconnect any previous observer
    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
      observerInstanceRef.current = null;
    }

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
        // reserve the next fetch immediately to avoid race increments
        isFetchingRef.current = true;
        setPage((p) => p + 1);
      }
    }, { rootMargin: '200px' });
    observerInstanceRef.current = io;
    io.observe(el);
    return () => {
      io.disconnect();
      if (observerInstanceRef.current === io) observerInstanceRef.current = null;
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (page === 1) return;
    loadPage(page);
  }, [page, loadPage]);

  // ensure lock is cleared when feedType resets
  useEffect(() => {
    isFetchingRef.current = false;
  }, [feedType]);

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  if (loading && posts.length === 0) {
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
  
  if (error && posts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">⚠️ Error loading posts</div>
          <div className="text-red-500 text-sm">{typeof error === 'string' ? error : 'Failed to load posts. Please refresh the page.'}</div>
        </div>
      </div>
    );
  }
  
  if (!loading && !error && !posts.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <div className="text-gray-600 text-lg font-medium">No posts to show</div>
        <div className="text-gray-500 text-sm mt-2">Be the first to create a post!</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}

      {loading && posts.length > 0 && <div className="text-center py-4 text-gray-500">Loading more posts…</div>}
      {error && posts.length > 0 && <div className="text-red-600 text-center py-4">Error: {typeof error === 'string' ? error : 'Failed to load more posts'}</div>}

      {/* sentinel */}
      <div ref={observerRef} style={{ height: 1 }} />

      <PostModal post={selectedPost} onClose={closePost} />
    </div>
  );
};

export default PostsList;
