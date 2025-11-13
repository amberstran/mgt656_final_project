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

// Get API URL from environment, ensure it ends with /api/
let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// Remove trailing slash if present, then add /api/
apiBaseUrl = apiBaseUrl.replace(/\/$/, '') + '/api/';

const API = axios.create({
  baseURL: apiBaseUrl,  // Django DRF backend
  withCredentials: true,                  // if using session auth
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
// fetchPosts supports pagination: page (1-based) and optional page_size
export const fetchPosts = (type, page = 1, page_size = 10) =>
  API.get(`posts/?feed=${type}&page=${page}&page_size=${page_size}`);
export const createPost = (postData) => API.post('posts/', postData);
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
