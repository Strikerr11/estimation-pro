import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

// Helper to get all registered users stored in browser memory
const getRegisteredUsers = (): Record<string, { user: User; password: string }> => {
  const data = localStorage.getItem('mock_registered_users');
  return data ? JSON.parse(data) : {};
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore current active session if logged in
    const activeSession = localStorage.getItem('mock_active_session');
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const cleanEmail = email.toLowerCase().trim();
    const registeredUsers = getRegisteredUsers();

    if (registeredUsers[cleanEmail]) {
      throw new Error('User already exists with this email.');
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      full_name: fullName || 'User',
      role: role || 'estimator',
      company: 'Demo Company',
      created_at: new Date().toISOString(),
    };

    // Save user in local registered database
    registeredUsers[cleanEmail] = { user: newUser, password };
    localStorage.setItem('mock_registered_users', JSON.stringify(registeredUsers));

    // Automatically set active user session
    setUser(newUser);
    localStorage.setItem('mock_active_session', JSON.stringify(newUser));
  };

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const registeredUsers = getRegisteredUsers();
    const account = registeredUsers[cleanEmail];

    if (!account) {
      throw new Error('No account found with this email. Please register first!');
    }

    if (account.password !== password) {
      throw new Error('Invalid email or password.');
    }

    // Login successful
    setUser(account.user);
    localStorage.setItem('mock_active_session', JSON.stringify(account.user));
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('mock_active_session');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);