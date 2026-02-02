import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  state: {
    isLoading: boolean;
    isSignIn: boolean;
    user: User | null;
  };
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthState {
  isLoading: boolean;
  isSignIn: boolean;
  user: User | null;
}

type AuthAction =
  | { type: 'RESTORE_TOKEN'; payload: { user: User | null; accessToken: string | null } }
  | { type: 'SIGN_IN'; payload: { user: User; accessToken: string } }
  | { type: 'SIGN_OUT' }
  | { type: 'SIGN_UP'; payload: { user: User; accessToken: string } };

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        isLoading: false,
        isSignIn: !!action.payload.user,
        user: action.payload.user,
      };
    case 'SIGN_IN':
      return {
        isLoading: false,
        isSignIn: true,
        user: action.payload.user,
      };
    case 'SIGN_UP':
      return {
        isLoading: false,
        isSignIn: true,
        user: action.payload.user,
      };
    case 'SIGN_OUT':
      return {
        isLoading: false,
        isSignIn: false,
        user: null,
      };
    default:
      return state;
  }
};

// Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignIn: false,
    user: null,
  });

  const setAccessToken = async (accessToken: string | null) => {
    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      await AsyncStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return null;
    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;
    await setAccessToken(accessToken);
    return accessToken;
  };

  // Bootstrap - restore session on app start
  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userJson = await AsyncStorage.getItem('user');

        if (accessToken && userJson) {
          const user = JSON.parse(userJson);
          await setAccessToken(accessToken);
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { user, accessToken },
          });
        } else {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { user: null, accessToken: null },
          });
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
        dispatch({
          type: 'RESTORE_TOKEN',
          payload: { user: null, accessToken: null },
        });
      }
    };

    bootstrapAsync();
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config || {};
        if (originalRequest.url?.includes('/auth/refresh')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshAccessToken();
            if (!newAccessToken) {
              await signOut();
              return Promise.reject(error);
            }
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            await signOut();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [signOut]);

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      // Save tokens
      await setAccessToken(accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'SIGN_IN',
        payload: { user, accessToken },
      });
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  // Sign Up
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user, accessToken, refreshToken } = response.data;

      // Save tokens
      await setAccessToken(accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'SIGN_UP',
        payload: { user, accessToken },
      });
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  // Sign Out
  const value: AuthContextType = {
    state,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
