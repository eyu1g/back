// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Authentication
export const login = (data: { email: string; password: string }) => api.post('/auth/signin', data);

// Founders APIs
export const getFounders = () => api.get('/founders');
export const createFounder = (founder: unknown, token: string) =>
  api.post('/founders', founder, { headers: { Authorization: `Bearer ${token}` } });
export const updateFounder = (id: string, founder: unknown, token: string) =>
  api.put(`/founders/${id}`, founder, { headers: { Authorization: `Bearer ${token}` } });
export const deleteFounder = (id: string, token: string) =>
  api.delete(`/founders/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// News APIs
export const getNews = () => api.get('/news');
export const createNews = (news: unknown, token: string) =>
  api.post('/news', news, { headers: { Authorization: `Bearer ${token}` } });
export const updateNews = (id: string, news: unknown, token: string) =>
  api.put(`/news/${id}`, news, { headers: { Authorization: `Bearer ${token}` } });
export const deleteNews = (id: string, token: string) =>
  api.delete(`/news/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Staff APIs
export const getStaff = () => api.get('/staff');
export const createStaff = (staff: unknown, token: string) =>
  api.post('/staff', staff, { headers: { Authorization: `Bearer ${token}` } });
export const updateStaff = (id: string, staff: unknown, token: string) =>
  api.put(`/staff/${id}`, staff, { headers: { Authorization: `Bearer ${token}` } });
export const deleteStaff = (id: string, token: string) =>
  api.delete(`/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } });
