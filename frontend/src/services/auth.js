import api from './api.js';
import { AUTH_ENDPOINTS, AUTH_STORAGE_KEYS } from '../constants/auth.js';

export const authService = {
    /**
     * Login user with email and password
     * @param {LoginCredentials} credentials 
     * @returns {Promise<AuthResponse>}
     */
    login: async (credentials) => {
        const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens and user data
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        return response.data;
    },

    /**
     * Register new user
     * @param {RegisterData} userData 
     * @returns {Promise<AuthResponse>}
     */
    register: async (userData) => {
        const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens and user data
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        return response.data;
    },

    /**
     * Logout user
     */
    logout: async () => {
        try {
            const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
                await api.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear all stored data
            localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(AUTH_STORAGE_KEYS.USER_DATA);
        }
    },

    /**
     * Refresh access token
     * @returns {Promise<string>}
     */
    refreshToken: async () => {
        const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post(AUTH_ENDPOINTS.REFRESH, { refreshToken });
        const { accessToken } = response.data;
        
        localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        return accessToken;
    },

    /**
     * Get current user profile
     * @returns {Promise<AuthUser>}
     */
    getProfile: async () => {
        const response = await api.get(AUTH_ENDPOINTS.PROFILE);
        const user = response.data;
        
        // Update stored user data
        localStorage.setItem(AUTH_STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        return user;
    },

    /**
     * Send password reset email
     * @param {string} email 
     * @returns {Promise<void>}
     */
    forgotPassword: async (email) => {
        const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
        return response.data;
    },

    /**
     * Reset password with token
     * @param {string} token 
     * @param {string} password 
     * @returns {Promise<void>}
     */
    resetPassword: async (token, password) => {
        const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
        return response.data;
    },

    /**
     * Get stored access token
     * @returns {string|null}
     */
    getAccessToken: () => {
        return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    },

    /**
     * Get stored user data
     * @returns {AuthUser|null}
     */
    getStoredUser: () => {
        const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        const token = authService.getAccessToken();
        const user = authService.getStoredUser();
        return !!(token && user);
    },
};
