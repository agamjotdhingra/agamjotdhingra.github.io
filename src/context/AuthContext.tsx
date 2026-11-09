import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const ADMIN_UUID = '855f8ee7-54e7-4137-b86a-ad6e1bc53f96';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate that the user matches the configured admin UUID
  const handleSession = async (currentSession: Session | null): Promise<void> => {
    if (!currentSession?.user) {
      setUser(null);
      setSession(null);
      return;
    }

    if (currentSession.user.id !== ADMIN_UUID) {
      // Requirement 7: If an authenticated user has a different UUID, deny access and sign them out.
      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
      return;
    }

    setUser(currentSession.user);
    setSession(currentSession);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // 1. Check existing session on application startup
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      await handleSession(initialSession);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // 2. Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      await handleSession(currentSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: new Error('Supabase client is not configured.') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        if (data.user.id !== ADMIN_UUID) {
          // Deny access and sign out
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          return {
            error: new Error('Access denied: Your account does not have administrator privileges.'),
          };
        }

        setUser(data.user);
        setSession(data.session);
      }

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('An unexpected error occurred during sign-in.'),
      };
    }
  };

  const signOut = async (): Promise<void> => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors during sign-out
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  const isAdmin = Boolean(user && user.id === ADMIN_UUID);

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
