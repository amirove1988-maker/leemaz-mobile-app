import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, apiClient } from '../services/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  language: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // For APK testing, skip backend call initially with timeout
        try {
          // Get user info using authAPI with timeout
          const response = await Promise.race([
            authAPI.getMe(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Network timeout')), 3000)
            )
          ]);
          setUser(response.data);
        } catch (error) {
          console.log('Backend not accessible, using offline mode. Error:', error.message);
          
          // Try to get stored user info
          const storedUser = await AsyncStorage.getItem('userInfo');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Set a dummy user for APK testing
            const offlineUser = {
              id: 'offline-user',
              email: 'offline@leemaz.com',
              full_name: 'Offline User',
              user_type: 'buyer',
              language: 'en',
              credits: 100
            };
            setUser(offlineUser);
            await AsyncStorage.setItem('userInfo', JSON.stringify(offlineUser));
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await Promise.race([
        authAPI.login(email, password),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 5000)
        )
      ]);
      const { access_token } = response.data;
      
      // Save token
      await AsyncStorage.setItem('authToken', access_token);
      
      // Get user info
      const userResponse = await authAPI.getMe();
      const userData = userResponse.data;
      setUser(userData);
      
      // Store user info locally for offline access
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      
      // For testing APK - allow offline login with demo credentials
      if (email === 'demo@leemaz.com' && password === 'demo123') {
        console.log('Using offline demo login');
        const demoUser = {
          id: 'demo-user',
          email: 'demo@leemaz.com',
          full_name: 'Demo User',
          user_type: 'buyer',
          language: 'en',
          credits: 100
        };
        
        await AsyncStorage.setItem('authToken', 'demo-token');
        await AsyncStorage.setItem('userInfo', JSON.stringify(demoUser));
        setUser(demoUser);
        return true;
      }
      
      return false;
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await authAPI.register(userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear token from storage
      await AsyncStorage.removeItem('authToken');
      
      // Clear token from api headers
      delete apiClient.defaults.headers.common['Authorization'];
      
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};