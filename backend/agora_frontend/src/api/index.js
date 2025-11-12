import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Django DRF backend
  withCredentials: true,                  // if using session auth
});

export const loginUser = (credentials) => API.post('auth/login/', credentials);
// fetchPosts supports pagination: page (1-based) and optional page_size
export const fetchPosts = (type, page = 1, page_size = 10) =>
  API.get(`posts/?feed=${type}&page=${page}&page_size=${page_size}`);
export const createPost = (postData) => API.post('posts/', postData);
export const fetchCircles = () => API.get('circles/');
export const joinCircle = (circleId) => API.post(`circles/${circleId}/join/`);
export const leaveCircle = (circleId) => API.post(`circles/${circleId}/leave/`);
export const fetchProfile = (userId) => API.get(`users/${userId}/`);
