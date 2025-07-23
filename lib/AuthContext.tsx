import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.log('🔍 Supabase client not configured');
      setLoading(false);
      return;
    }

    const getInitialSession = async () => {
      if (!supabase) return;
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔍 Initial Supabase session:', session);
      console.log('🔍 Initial session error:', error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    ) || { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { 
        error: { 
          message: 'Authentication service not configured. Please set up your Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) to enable sign-in functionality.' 
        } 
      };
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Authentication service not configured. Please set up your Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) to enable password reset functionality.' } };
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
