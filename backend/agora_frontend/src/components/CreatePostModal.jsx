import React, { useState } from 'react';
import { createPost } from '../api';

const CreatePostModal = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnon, setIsAnon] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

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
        payload.append('image', imageFile);
      } else {
        payload = { title, content, is_anonymous: isAnon };
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2>Create a post</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#999', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>✕</button>
        </div>
        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '8px', background: '#fee', color: '#c33', fontSize: '0.875rem', border: '1px solid #fcc' }}>
            {typeof error === 'string' ? error : 'Error creating post'}
          </div>
        )}
        <form onSubmit={submit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', fontWeight: '500' }}>Add an image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
              style={{ padding: '0.5rem', fontSize: '0.875rem' }}
            />
            {imageFile && (
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>Selected: {imageFile.name}</div>
            )}
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#666', marginBottom: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={isAnon} onChange={(e) => setIsAnon(e.target.checked)} style={{ width: 'auto', margin: 0 }} />
            Post anonymously
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button disabled={submitting} type="submit">
              {submitting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
