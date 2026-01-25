'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

/**
 * Hook personalizado para manejar la autenticación con Supabase.
 * 
 * @returns Objeto con el estado de autenticación y funciones relacionadas.
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Obtener sesión inicial
        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        initSession();

        // Escuchar cambios en la autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    /**
     * Cierra la sesión del usuario actual.
     */
    const signOut = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            await supabase.auth.signOut();
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Registra un nuevo usuario con correo y contraseña.
     * 
     * @param email - Correo electrónico del usuario.
     * @param password - Contraseña del usuario.
     * @param metadata - Datos opcionales para el perfil (nombre, foto, etc).
     * @returns Promesa con el resultado del registro.
     */
    const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
        if (!supabase) return { error: new Error('Supabase no está configurado') };

        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
    }, []);

    /**
     * Inicia sesión con correo y contraseña.
     * 
     * @param email - Correo electrónico.
     * @param password - Contraseña.
     * @returns Promesa con el resultado del inicio de sesión.
     */
    const signIn = useCallback(async (email: string, password: string) => {
        if (!supabase) return { error: new Error('Supabase no está configurado') };

        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    }, []);

    return {
        user,
        session,
        loading,
        signOut,
        signUp,
        signIn,
        isAuthenticated: !!user
    };
}
