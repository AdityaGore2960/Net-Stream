import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Ensure axios sends cookies for cross-origin requests
axios.defaults.withCredentials = true;

// Axios Interceptor for 401 Unauthorized errors (Token Refresh)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401, not a retry, and not on auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token using the refresh cookie
        const { data } = await axios.post(`${API_URL}/auth/refresh`);

        if (data.success) {
          // Save new token
          localStorage.setItem('token', data.token);

          // Update the failed request with the new token
          originalRequest.headers.Authorization = `Bearer ${data.token}`;

          // Update the zustand store state
          const currentState = useAuthStore.getState();
          if (currentState.user) {
            currentState.setCredentials(currentState.user, data.token);
          }

          // Retry original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out user
        useAuthStore.getState().clearCredentials();
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Zustand store for Authentication State
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Initially true while checking auth
  error: null,

  /**
   * Set user and token explicitly
   */
  setCredentials: (user, token) => {
    set({ user, token, isAuthenticated: true, isLoading: false, error: null });
  },

  /**
   * Clear user credentials
   */
  clearCredentials: () => {
    set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  },

  /**
   * Login action
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem('token', token);

      set({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
      return { success: false, message };
    }
  },

  /**
   * Register action
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/register`, userData);
      // Do not auto-login after registration, just clear loading state
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false, isAuthenticated: false });
      return { success: false, message };
    }
  },

  /**
   * Logout action
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  /**
   * Update Profile action (stub)
   */
  updateProfile: async (data) => {
    // Stub for updating profile
    console.log('Update profile:', data);
  },

  /**
   * Load user from token
   */
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data.user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
