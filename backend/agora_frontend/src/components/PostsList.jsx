import React, { useEffect, useRef, useState, useCallback } from 'react';
import PostCard from './PostCard';
import PostModal from './PostModal';
import { fetchPosts } from '../api';

const PostsList = ({ feedType = 'new', pageSize = 10, reloadSignal = 0 }) => {
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
    // reset when feedType or reloadSignal changes
    setPage(1);
    setHasMore(true);
    setPosts([]);
    loadPage(1);
  }, [feedType, reloadSignal, loadPage]);

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
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="post-card" style={{ opacity: 0.6 }}>
              <div style={{ height: '1rem', background: '#e5e5e5', borderRadius: '4px', width: '30%', marginBottom: '1rem' }}></div>
              <div style={{ height: '1.5rem', background: '#e5e5e5', borderRadius: '4px', width: '75%', marginBottom: '0.5rem' }}></div>
              <div style={{ height: '1rem', background: '#e5e5e5', borderRadius: '4px', width: '100%', marginBottom: '0.5rem' }}></div>
              <div style={{ height: '1rem', background: '#e5e5e5', borderRadius: '4px', width: '60%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error && posts.length === 0) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ background: '#fee', border: '1px solid #fcc', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ color: '#c33', fontWeight: '600', marginBottom: '0.5rem' }}>⚠️ Error loading posts</div>
          <div style={{ color: '#a33', fontSize: '0.875rem' }}>{typeof error === 'string' ? error : 'Failed to load posts. Please refresh the page.'}</div>
        </div>
      </div>
    );
  }
  
  if (!loading && !error && !posts.length) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📭</div>
        <div style={{ color: '#666', fontSize: '1.125rem', fontWeight: '500' }}>No posts to show</div>
        <div style={{ color: '#999', fontSize: '0.875rem', marginTop: '0.5rem' }}>Be the first to create a post!</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1rem', paddingBottom: '5rem' }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}

      {loading && posts.length > 0 && <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>Loading more posts…</div>}
      {error && posts.length > 0 && <div style={{ color: '#c33', textAlign: 'center', padding: '1rem' }}>Error: {typeof error === 'string' ? error : 'Failed to load more posts'}</div>}

      {/* sentinel */}
      <div ref={observerRef} style={{ height: 1 }} />

      <PostModal post={selectedPost} onClose={closePost} />
    </div>
  );
};

export default PostsList;
