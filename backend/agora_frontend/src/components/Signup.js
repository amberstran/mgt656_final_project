import React, { useState } from 'react';
import { register } from '../api';

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', bio: '', avatar: '', program: '', grade: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        bio: form.bio,
        avatar: form.avatar,
        program: form.program,
        grade: form.grade,
      });
      // Redirect to home page after successful registration
      // The user is auto-logged in by the backend
      window.location.href = '/';
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to register';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container" style={{ maxWidth: 480, margin: '1rem auto' }}>
      <h2>Create Account</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>
          Username
          <input name="username" value={form.username} onChange={onChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={onChange} required />
        </label>
        <label>
          Bio
          <textarea name="bio" value={form.bio} onChange={onChange} />
        </label>
        <label>
          Avatar URL
          <input name="avatar" value={form.avatar} onChange={onChange} />
        </label>
        <label>
          Program
          <input name="program" value={form.program} onChange={onChange} />
        </label>
        <label>
          Grade
          <input name="grade" value={form.grade} onChange={onChange} />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
    </div>
  );
}