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

        // Si hay usuario, asegúranos de tener fila en profiles (y setear display_name si viene en metadata)
        (async () => {
            if (!session?.user) return;
            const metaName =
                session.user.user_metadata?.display_name ||
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                null;

            await supabase
                .from('profiles')
                .upsert(
                    { id: session.user.id, ...(metaName ? { display_name: metaName } : {}) },
                    { onConflict: 'id' }
                );
        })();

        return () => {
            mounted = false;
            sub?.subscription?.unsubscribe?.();
        };
    }, [session?.user?.id]);

    const value = {
        session,
        user: session?.user ?? null,

        signIn: (email, password) =>
            supabase.auth.signInWithPassword({ email, password }),

        // ⬇️ aceptamos displayName y lo guardamos en user_metadata
        signUp: (email, password, displayName) =>
            supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { display_name: displayName?.trim() || '' },
                },
            }),

        signOut: () => supabase.auth.signOut(),

        resetPassword: (email) =>
            supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://TU-PROYECTO.supabase.co/auth/v1/callback',
            }),

        // ⬇️ si no pasas id, lo completamos con el usuario actual
        updateProfile: async (data) => {
            const { data: u } = await supabase.auth.getUser();
            const id = data?.id ?? u?.user?.id;
            if (!id) throw new Error('No hay usuario autenticado');
            return supabase.from('profiles').upsert({ id, ...data });
        },

        updatePassword: (newPassword) => supabase.auth.updateUser({ password: newPassword }),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
