import { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = authApi.getCurrentUser(token);
    
    if (currentUser) {
      const savedProfile = localStorage.getItem(`user_profile_${currentUser.id}`);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUser({ ...currentUser, ...parsed });
        } catch (e) {
          setUser(currentUser);
        }
      } else {
        setUser(currentUser);
      }
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem(`user_profile_${prev.id}`, JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    const savedProfile = localStorage.getItem(`user_profile_${data.user.id}`);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUser({ ...data.user, ...parsed });
        return;
      } catch (e) {}
    }
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
