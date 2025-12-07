/**
 * @fileoverview Hook de Estado de Conexión
 * 
 * Hook personalizado que detecta y monitorea el estado de conexión del navegador.
 * Proporciona información en tiempo real sobre si la aplicación está online u offline.
 * 
 * Características:
 * - Detección automática del estado inicial
 * - Listeners para eventos online/offline
 * - Limpieza automática de listeners
 * - Compatible con SSR (Next.js)
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Hook que detecta el estado de conexión del navegador.
 * 
 * @returns {boolean} true si está online, false si está offline
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isOnline = useOnlineStatus();
 *   return <div>{isOnline ? 'Conectado' : 'Sin conexión'}</div>;
 * }
 * ```
 */
export function useOnlineStatus(): boolean {
    // Estado inicial: asumimos online en SSR, luego se actualiza en cliente
    const [isOnline, setIsOnline] = useState<boolean>(true);

    useEffect(() => {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined') return;

        // Establecer estado inicial basado en navigator.onLine
        setIsOnline(navigator.onLine);

        /**
         * Handler para evento 'online'
         * Se dispara cuando el navegador recupera la conexión
         */
        const handleOnline = () => {
            console.log('🌐 Conexión restaurada');
            setIsOnline(true);
        };

        /**
         * Handler para evento 'offline'
         * Se dispara cuando el navegador pierde la conexión
         */
        const handleOffline = () => {
            console.log('📴 Conexión perdida - Modo offline activado');
            setIsOnline(false);
        };

        // Registrar listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup: remover listeners al desmontar
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
