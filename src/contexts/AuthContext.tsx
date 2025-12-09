import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole, additionalData?: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  'student@university.edu': {
    id: 'student-1',
    email: 'student@university.edu',
    name: 'Alex Johnson',
    role: 'student',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
  },
  'professor@university.edu': {
    id: 'professor-1',
    email: 'professor@university.edu',
    name: 'Dr. Sarah Williams',
    role: 'professor',
    department: 'Computer Science',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
  },
  'admin@university.edu': {
    id: 'admin-1',
    email: 'admin@university.edu',
    name: 'Michael Chen',
    role: 'admin',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('attendease_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    if (mockUser && mockUser.role === role) {
      setUser(mockUser);
      localStorage.setItem('attendease_user', JSON.stringify(mockUser));
    } else {
      // Create a demo user for the role
      const demoUser: User = {
        id: `${role}-demo`,
        email,
        name: email.split('@')[0],
        role,
        department: 'Computer Science',
        createdAt: new Date(),
      };
      setUser(demoUser);
      localStorage.setItem('attendease_user', JSON.stringify(demoUser));
    }
    setIsLoading(false);
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    additionalData?: Record<string, unknown>
  ) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      department: additionalData?.department as string || 'General',
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('attendease_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('attendease_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('attendease_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
