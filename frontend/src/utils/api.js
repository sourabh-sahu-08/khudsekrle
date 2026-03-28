import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (data) => API.post('/auth/login', data),
    register: (data) => API.post('/auth/register', data),
    getMe: () => API.get('/auth/me'),
};

export const analysisService = {
    analyze: (data) => API.post('/analyze', data),
    getHistory: () => API.get('/analyze/history'),
    getAnalysisById: (id) => API.get(`/analyze/${id}`),
    deleteAnalysis: (id) => API.delete(`/analyze/${id}`),
};

export default API;
