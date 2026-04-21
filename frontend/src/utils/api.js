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

// Add 401 response interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/auth/login') {
                window.location.href = '/auth/login?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (data) => API.post('/auth/login', data),
    register: (data) => API.post('/auth/register', data),
    getMe: () => API.get('/auth/me'),
    updateDetails: (data) => API.put('/auth/updatedetails', data),
    updatePassword: (data) => API.put('/auth/updatepassword', data),
};

export const analysisService = {
    analyze: (data) => API.post('/analyze', data),
    getHistory: () => API.get('/analyze/history'),
    getAnalysisById: (id) => API.get(`/analyze/${id}`),
    deleteAnalysis: (id) => API.delete(`/analyze/${id}`),
    getStats: () => API.get('/analyze/stats'),
};

export default API;
