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

  const openPost = (post) => setSelectedPost(post);
  const closePost = () => setSelectedPost(null);

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onClick={openPost} />
      ))}

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">Error: {JSON.stringify(error)}</div>}

      {/* sentinel */}
      <div ref={observerRef} style={{ height: 1 }} />

      <PostModal post={selectedPost} onClose={closePost} />
    </div>
  );
};

export default PostsList;
