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

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Django DRF backend
  withCredentials: true,                  // if using session auth
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
export const fetchPosts = (type) => API.get(`posts/?feed=${type}`);
export const createPost = (postData) => API.post('posts/', postData);
export const fetchCircles = () => API.get('circles/');
export const deletePost = (postId) => API.delete(`posts/${postId}/`);
export const joinCircle = (circleId) => API.post(`circles/${circleId}/join/`);
export const leaveCircle = (circleId) => API.post(`circles/${circleId}/leave/`);
export const fetchProfile = (userId) => API.get(`users/${userId}/`);
export const toggleLike = (postId) => API.post(`posts/${postId}/like/`);
export const addComment = (postId, data) => API.post(`posts/${postId}/comment/`, data);
