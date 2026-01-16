/**
 * @fileoverview Indicador de Estado de Conexión
 * 
 * Componente que muestra visualmente el estado de conexión de la aplicación.
 * Muestra un indicador discreto cuando la aplicación está offline.
 * 
 * Características:
 * - Indicador visual discreto en la esquina
 * - Mensajes informativos en español
 * - Auto-ocultación cuando está online
 */

'use client';

import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Componente que muestra el estado de conexión actual.
 * 
 * - Muestra un badge cuando está offline
 * - Se oculta automáticamente cuando está online
 */
export function OnlineStatusIndicator() {
    const isOnline = useOnlineStatus();



    // No mostrar nada si está online (modo normal)
    if (isOnline) {
        return null;
    }

    // Mostrar indicador cuando está offline
    return (
        <div className="fixed bottom-4 right-4 z-50 print:hidden">
            <div className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <WifiOff className="h-5 w-5 animate-pulse" />
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">Modo Sin Conexión</span>
                    <span className="text-xs opacity-90">Todos los datos se guardan localmente</span>
                </div>
            </div>
        </div>
    );
}
