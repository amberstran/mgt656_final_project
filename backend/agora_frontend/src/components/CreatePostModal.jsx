import React, { useState, useEffect } from 'react';
import { createPost, fetchCircles } from '../api';
import './Modals.css';

const CreatePostModal = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchCircles();
        const data = res.data || [];
        // Only include circles the user is a member of (frontend UX choice)
        const joined = data.filter((c) => c.is_member);
        if (mounted) {
          setCircles(joined);
          if (joined.length > 0) setSelectedCircle(joined[0].id);
        }
      } catch (err) {
        console.warn('Failed to fetch circles for post modal', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let payload;
      if (imageFile) {
        payload = new FormData();
        payload.append('title', title);
        payload.append('content', content);
        payload.append('is_anonymous', String(isAnon));
        if (selectedCircle) payload.append('circle', String(selectedCircle));
        payload.append('image', imageFile);
      } else {
        payload = { title, content, is_anonymous: isAnon };
        if (selectedCircle) payload.circle = selectedCircle;
      }
      const res = await createPost(payload);
      if (onCreated) onCreated(res.data);
      onClose();
      setTitle('');
      setContent('');
      setIsAnon(true);
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create a post</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {error && (
          <div className="error-box">{typeof error === 'string' ? error : 'Error creating post'}</div>
        )}

        <form onSubmit={submit}>
          <div className="form-field">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="form-field">
            <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required rows={6} />
          </div>

          <div className="form-field">
            <label className="field-label">Post in circle (optional)</label>
            <select value={selectedCircle || ''} onChange={(e) => setSelectedCircle(e.target.value || null)}>
              <option value="">-- No circle --</option>
              {circles.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.member_count || 0})</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="field-label">Add an image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
            {imageFile && (
              <div className="small-muted">Selected: {imageFile.name}</div>
            )}
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={isAnon} onChange={(e) => setIsAnon(e.target.checked)} />
            <span>Post anonymously</span>
          </label>

          <div className="form-actions">
            <button type="button" className="btn btn-muted" onClick={onClose}>Cancel</button>
            <button disabled={submitting} type="submit" className="btn btn-primary">{submitting ? 'Posting…' : 'Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
