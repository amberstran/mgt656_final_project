import axios from 'axios';

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Determine API base URL.
// In development we rely on Create React App's proxy (package.json "proxy") so all
// requests to '/api/*' are forwarded to http://localhost:8000. This keeps the
// origin consistent (http://localhost:3000) and Safari will send session cookies.
// In production, fall back to REACT_APP_API_URL or localhost backend.
const isDev = process.env.NODE_ENV === 'development';
let apiBaseUrl;
if (isDev) {
  apiBaseUrl = '/api/';
} else {
  const root = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  apiBaseUrl = root.replace(/\/$/, '') + '/api/';
}

const API = axios.create({
  baseURL: apiBaseUrl, // In dev: '/api/' (proxied). In prod: full backend URL.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CSRF token to all POST, PUT, DELETE requests
API.interceptors.request.use(
  (config) => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken && ['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (credentials) => API.post('auth/login/', credentials);
export const logoutUser = () => API.post('auth/logout/', {});
// Ensure CSRF cookie exists in production before mutating requests
export const ensureCsrf = async () => {
  try {
    const csrftoken = getCookie('csrftoken');
    if (!csrftoken) {
      await API.get('auth/csrf/');
    }
  } catch (e) {
    // Non-fatal: CSRF endpoint should be accessible cross-origin
    console.warn('Unable to prefetch CSRF token', e);
  }
};
export const loginUserWithCsrf = async (credentials) => {
  await ensureCsrf();
  return API.post('auth/login/', credentials);
};
export const register = async (data) => {
  // data: { username, password, bio?, avatar?, program?, grade? }
  await ensureCsrf();
  const res = await API.post('auth/register/', data);
  return res.data;
};
// fetchPosts supports pagination: page (1-based) and optional page_size
export const fetchPosts = (type, page = 1, page_size = 10, circleId = null) => {
  let url = `posts/?feed=${type}&page=${page}&page_size=${page_size}`;
  if (circleId) url += `&circle=${encodeURIComponent(circleId)}`;
  return API.get(url);
};
export const createPost = (postData) => {
  // If a FormData is passed (for image upload), use multipart
  if (typeof FormData !== 'undefined' && postData instanceof FormData) {
    return API.post('posts/', postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
  return API.post('posts/', postData);
};
// Note: These endpoints are not yet implemented in the backend
// They return 404 but won't cause 400 errors
export const fetchCircles = () => API.get('circles/').catch(err => {
  console.warn('Circles endpoint not implemented:', err);
  return { data: [] };
});
export const deletePost = (postId) => API.delete(`posts/${postId}/`);
export const joinCircle = (circleId) => API.post(`circles/${circleId}/join/`).catch(err => {
  console.warn('Join circle endpoint not implemented:', err);
  throw err;
});
export const leaveCircle = (circleId) => API.post(`circles/${circleId}/leave/`).catch(err => {
  console.warn('Leave circle endpoint not implemented:', err);
  throw err;
});
export const fetchProfile = (userId) => API.get(`users/${userId}/`).catch(err => {
  console.warn('User profile endpoint not implemented:', err);
  throw err;
});
export const toggleLike = (postId) => API.post(`posts/${postId}/like/`);
export const addComment = (postId, data) => API.post(`posts/${postId}/comment/`, data);

// Export the underlying axios instance so callers (e.g. src/index.js) can set
// default headers (CSRF token) when needed. This avoids relying solely on
// document.cookie which can be brittle in some dev setups.
export { API };
export const reportPost = (postId, data) => API.post(`posts/${postId}/report/`, data);
export const reportComment = (commentId, data) => API.post(`comments/${commentId}/report/`, data);
export const fetchReports = () => API.get('reports/');
export const moderateReport = (reportId, action) => API.post(`reports/${reportId}/action/`, { action });
