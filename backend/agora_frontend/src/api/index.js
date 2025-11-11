import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Django DRF backend
  withCredentials: true,                  // if using session auth
});

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
