import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '../types';
import { api } from '../services/api';
import { getToken, setToken, removeToken, isAuthenticated } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const authResponse = await api.login(credentials);
      
      // Validate response structure
      if (!authResponse || !authResponse.token || !authResponse.user) {
        throw new Error('Invalid login response from server');
      }
      
      setToken(authResponse.token);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const authResponse = await api.register(userData);
      
      // Validate response structure
      if (!authResponse || !authResponse.token || !authResponse.user) {
        throw new Error('Invalid registration response from server');
      }
      
      setToken(authResponse.token);
      setUser(authResponse.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};