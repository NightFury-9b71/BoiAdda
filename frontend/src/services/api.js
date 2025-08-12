import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants/api.js';
import { AUTH_STORAGE_KEYS, AUTH_ROUTES } from '../constants/auth.js';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken
                    });
                    
                    const { accessToken } = response.data;
                    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                    
                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
                window.location.href = AUTH_ROUTES.LOGIN;
            }
        }

        return Promise.reject(error);
    }
);

export const bookService = {
    getAllBooks: async () => {
        const response = await api.get(ENDPOINTS.ALL_BOOKS);
        return response.data;
    },

    borrowBook: async ({ bookId, userId }) => {
        const response = await api.post(ENDPOINTS.BORROW_BOOK(bookId), { user_id: userId });
        return response.data;
    },

    donateBook: async (bookData) => {
        const response = await api.post(ENDPOINTS.DONATE_BOOK, bookData);
        return response.data;
    }
};

export default api;
