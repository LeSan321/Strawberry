import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
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
      if (!supabase) {
        console.error('🚨 DIAGNOSTIC: Cannot get initial session - Supabase client not configured');
        setLoading(false);
        return;
      }
      
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('🔍 Initial Supabase session:', session);
      console.log('🔍 Initial session error:', error);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    let subscription: { unsubscribe: () => void };
    
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state change:', event, session);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('👤 DIAGNOSTIC: Ensuring user profile exists...');
            await ensureUserProfile(session.user);
          }
          
          setLoading(false);
        }
      );
      subscription = data.subscription;
    } else {
      subscription = { unsubscribe: () => {} };
    }

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user: User) => {
    if (!supabase) {
      console.error('🚨 DIAGNOSTIC: Cannot ensure user profile - Supabase client not configured');
      return;
    }
    
    try {
      console.log('🔍 DIAGNOSTIC: Checking if user profile exists for:', user.email);
      const { data: profile, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log('➕ DIAGNOSTIC: Creating user profile for:', user.email);
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.user_metadata?.full_name || null,
            image: user.user_metadata?.avatar_url || null
          });

        if (insertError) {
          console.error('❌ DIAGNOSTIC: Error creating user profile:', insertError);
        } else {
          console.log('✅ DIAGNOSTIC: User profile created successfully');
        }
      } else if (profile) {
        console.log('✅ DIAGNOSTIC: User profile already exists');
      } else if (error) {
        console.error('❌ DIAGNOSTIC: Error checking user profile:', error);
      }
    } catch (error) {
      console.error('❌ DIAGNOSTIC: Critical exception ensuring user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔍 DIAGNOSTIC: Supabase URL being used:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 DIAGNOSTIC: Supabase Anon Key being used:', import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('🔍 DIAGNOSTIC: Supabase client instance:', supabase);
    console.log('🔍 DIAGNOSTIC: Sign-in attempt with email:', email);
    
    if (!supabase) {
      const configError = { message: 'Supabase client not configured - environment variables may be undefined' };
      console.error('🚨 DIAGNOSTIC: Supabase client not configured:', configError);
      return { error: configError };
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔍 DIAGNOSTIC: Sign-in response data:', data);
      console.log('🔍 DIAGNOSTIC: Sign-in response error:', error);
      
      if (error) {
        console.error('🚨 DIAGNOSTIC: Detailed sign-in error object:', error);
        console.error('🚨 DIAGNOSTIC: Error message:', error.message);
        console.error('🚨 DIAGNOSTIC: Error status:', error.status);
      } else {
        console.log('✅ DIAGNOSTIC: Sign-in successful:', data);
      }
      
      return { error };
    } catch (e) {
      console.error('🚨 DIAGNOSTIC: Critical exception during sign-in:', e);
      return { error: { message: `Critical sign-in error: ${e}` } };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('🔍 DIAGNOSTIC: SignUp - Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 DIAGNOSTIC: SignUp - Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('🔍 DIAGNOSTIC: SignUp - Client instance:', supabase);
    
    if (!supabase) {
      const configError = { message: 'Supabase client not configured - environment variables may be undefined' };
      console.error('🚨 DIAGNOSTIC: SignUp - Supabase client not configured:', configError);
      return { error: configError };
    }
    
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'https://strawberryriff.com';
      console.log('🔍 DIAGNOSTIC: SignUp - Email redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });
      
      console.log('🔍 DIAGNOSTIC: SignUp response data:', data);
      console.log('🔍 DIAGNOSTIC: SignUp response error:', error);
      
      if (error) {
        console.error('🚨 DIAGNOSTIC: Detailed signup error object:', error);
      } else {
        console.log('✅ DIAGNOSTIC: SignUp successful:', data);
        console.log('🔍 DIAGNOSTIC: User confirmation required:', !data.session && data.user && !data.user.email_confirmed_at);
      }
      
      return { error };
    } catch (e) {
      console.error('🚨 DIAGNOSTIC: Critical exception during signup:', e);
      return { error: { message: `Critical signup error: ${e}` } };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔍 DIAGNOSTIC: ResetPassword - Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('🔍 DIAGNOSTIC: ResetPassword - Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
    console.log('🔍 DIAGNOSTIC: ResetPassword - Client instance:', supabase);
    
    if (!supabase) {
      const configError = { message: 'Supabase client not configured - environment variables may be undefined' };
      console.error('🚨 DIAGNOSTIC: ResetPassword - Supabase client not configured:', configError);
      return { error: configError };
    }
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      console.log('🔍 DIAGNOSTIC: ResetPassword response data:', data);
      console.log('🔍 DIAGNOSTIC: ResetPassword response error:', error);
      
      if (error) {
        console.error('🚨 DIAGNOSTIC: Detailed reset password error object:', error);
      } else {
        console.log('✅ DIAGNOSTIC: ResetPassword successful:', data);
      }
      
      return { error };
    } catch (e) {
      console.error('🚨 DIAGNOSTIC: Critical exception during password reset:', e);
      return { error: { message: `Critical password reset error: ${e}` } };
    }
  };

  const signOut = async () => {
    console.log('🔍 DIAGNOSTIC: SignOut - Supabase client instance:', supabase);
    if (!supabase) {
      console.error('🚨 DIAGNOSTIC: Cannot sign out - Supabase client not configured');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      console.log('🔍 DIAGNOSTIC: SignOut response error:', error);
      
      if (error) {
        console.error('🚨 DIAGNOSTIC: SignOut error:', error);
      } else {
        console.log('✅ DIAGNOSTIC: SignOut successful');
      }
    } catch (e) {
      console.error('🚨 DIAGNOSTIC: Critical exception during signOut:', e);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
