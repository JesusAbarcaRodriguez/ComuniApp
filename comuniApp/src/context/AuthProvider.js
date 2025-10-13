// src/context/AuthContext.js
import React, { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            const { data } = await supabase.auth.getSession();
            if (mounted) setSession(data.session ?? null);
            setLoading(false);
        };
        init();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
            setSession(sess ?? null);
        });

        if (!session?.user) return;
        (async () => {
            // Crea el row si no existe
            await supabase.from('profiles').upsert({ id: session.user.id }, { onConflict: 'id' });
        })();

        return () => {
            mounted = false;
            sub?.subscription?.unsubscribe?.();
        };
    }, [session?.user?.id]);

    const value = {
        session,
        user: session?.user ?? null,
        signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
        signUp: (email, password) => supabase.auth.signUp({ email, password }),
        signOut: () => supabase.auth.signOut(),
        resetPassword: (email) =>
            supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://TU-PROYECTO.supabase.co/auth/v1/callback', // opcional si usas deep link
            }),
        updateProfile: (data) => supabase.from('profiles').upsert(data),
        updatePassword: (newPassword) => supabase.auth.updateUser({ password: newPassword }),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
