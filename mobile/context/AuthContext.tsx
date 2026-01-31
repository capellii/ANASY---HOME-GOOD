import React, { createContext, useContext, useEffect, useReducer } from 'react';
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

  // Bootstrap - restore session on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userJson = await AsyncStorage.getItem('user');

        if (accessToken && userJson) {
          const user = JSON.parse(userJson);
          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
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

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      // Save tokens
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

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
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

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
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user');

      // Remove API header
      delete api.defaults.headers.common['Authorization'];

      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

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
