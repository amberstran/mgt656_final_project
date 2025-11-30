import React, { useState } from 'react';
import { register } from '../api';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    bio: '',
    avatar: '',
    program: '',
    grade: '',
    email: '' // Add email field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'email') {
      if (e.target.value && !e.target.value.endsWith('@yale.edu')) {
        setEmailError('Please enter your Yale email address ending with @yale.edu');
      } else {
        setEmailError('');
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith('@yale.edu')) {
      setEmailError('Please enter your Yale email address ending with @yale.edu');
      return;
    }
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
        email: form.email // Include email in registration
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial"
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        background: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{
          marginTop: 0,
          color: '#222',
          fontSize: '2rem',
          marginBottom: '10px',
          textAlign: 'center',
          fontWeight: 700
        }}>Create Account</h2>
        <p style={{
          color: '#666',
          lineHeight: 1.5,
          marginBottom: '24px',
          textAlign: 'center'
        }}>Sign up to join the Agora community</p>
        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>{error}</div>
        )}
        <form onSubmit={onSubmit}>
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} required disabled={loading} />
          {emailError && (
            <div style={{color:'#c33',fontSize:'0.95rem',marginBottom:'12px'}}>{emailError}</div>
          )}
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Username</label>
          <input type="text" name="username" value={form.username} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} required disabled={loading} />
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} required disabled={loading} />
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Bio</label>
          <textarea name="bio" value={form.bio} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} rows={2} />
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Avatar URL</label>
          <input type="url" name="avatar" value={form.avatar} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} />
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Program</label>
          <input type="text" name="program" value={form.program} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} />
          <label style={{fontWeight:600, color:'#222', fontSize:'14px', marginTop:'16px'}}>Grade</label>
          <input type="text" name="grade" value={form.grade} onChange={onChange} style={{width:'100%',padding:'12px',marginTop:'6px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'15px',boxSizing:'border-box',fontFamily:'inherit',marginBottom:'12px'}} />
          <button type="submit" disabled={loading} style={{width:'100%',background:'#667eea',color:'white',padding:'14px',borderRadius:'8px',fontWeight:600,fontSize:'1rem',border:'none',cursor:loading?'not-allowed':'pointer',marginTop:'24px',transition:'background 0.2s'}}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}