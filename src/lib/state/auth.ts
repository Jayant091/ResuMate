import { writable } from 'svelte/store';
import { apiClient, type User, type AuthResponse } from '../api/client.js';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
};

// Create auth store
export const authStore = writable<AuthState>(initialState);

// Auth actions
export const authActions = {
  // Initialize auth state from localStorage
  async initialize() {
    authStore.update(state => ({ ...state, isLoading: true }));
    
    try {
      const token = localStorage.getItem('jwt');
      if (token) {
        const response = await apiClient.getMe();
        authStore.update(state => ({
          ...state,
          user: response.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        authStore.update(state => ({ ...state, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid token
      localStorage.removeItem('jwt');
      authStore.update(state => ({
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  },

  // Register new user
  async register(data: { name: string; email: string; password: string }) {
    authStore.update(state => ({ ...state, isLoading: true }));
    
    try {
      const response: AuthResponse = await apiClient.register(data);
      localStorage.setItem('jwt', response.token);
      
      authStore.update(state => ({
        ...state,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      }));
      
      return { success: true, user: response.user };
    } catch (error) {
      authStore.update(state => ({ ...state, isLoading: false }));
      return { success: false, error: error.message };
    }
  },

  // Login user
  async login(data: { email: string; password: string }) {
    authStore.update(state => ({ ...state, isLoading: true }));
    
    try {
      const response: AuthResponse = await apiClient.login(data);
      localStorage.setItem('jwt', response.token);
      
      authStore.update(state => ({
        ...state,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      }));
      
      return { success: true, user: response.user };
    } catch (error) {
      authStore.update(state => ({ ...state, isLoading: false }));
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('jwt');
    authStore.update(state => ({
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    }));
  },

  // Refresh user data
  async refreshUser() {
    try {
      const response = await apiClient.getMe();
      authStore.update(state => ({
        ...state,
        user: response.user,
      }));
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, user might be logged out
      this.logout();
      return { success: false, error: error.message };
    }
  },
};

// Subscribe to auth store changes
authStore.subscribe((state) => {
  // Update token in localStorage when it changes
  if (state.token && typeof window !== 'undefined') {
    localStorage.setItem('jwt', state.token);
  } else if (!state.token && typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
  }
});
