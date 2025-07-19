import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../types';
import { enhancedUsers } from '../data/enhancedSampleData';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(enhancedUsers[0]); // Set initial user to Super Admin for testing
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = enhancedUsers.find((u: User) => u.email === email);
    if (foundUser && password === 'admin123') {
      setUser(foundUser);
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
