import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
    user: SupabaseUser | null;
    session: Session | null;
    isAdmin: boolean;
    loginWithPassword: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    registerWithPassword: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loginWithPassword = async (email: string, password: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setIsLoading(false);
        if (error) throw error;
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        // Note: isLoading stays true until redirect happens
        if (error) {
            setIsLoading(false);
            throw error;
        }
    };

    const registerWithPassword = async (email: string, password: string, fullName: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin,
                data: {
                    full_name: fullName
                }
            }
        });
        setIsLoading(false);
        if (error) throw error;
    }

    const logout = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setIsLoading(false);
    };

    // Admin panel is removed, so isAdmin is always false for safety
    const isAdmin = false;

    return (
        <AuthContext.Provider value={{ user, session, isAdmin, loginWithPassword, loginWithGoogle, registerWithPassword, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
