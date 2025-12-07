/**
 * @fileoverview Indicador de Estado de Conexión
 * 
 * Componente que muestra visualmente el estado de conexión de la aplicación.
 * Incluye notificaciones toast cuando cambia el estado online/offline.
 * 
 * Características:
 * - Indicador visual discreto en la esquina
 * - Toast notifications en cambios de estado
 * - Mensajes informativos en español
 * - Auto-ocultación cuando está online
 */

'use client';

import { useEffect, useRef } from 'react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useToast } from '@/shared/components/ui/use-toast';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Componente que muestra el estado de conexión actual.
 * 
 * - Muestra un badge cuando está offline
 * - Envía notificaciones toast en cambios de estado
 * - Se oculta automáticamente cuando está online
 */
export function OnlineStatusIndicator() {
    const isOnline = useOnlineStatus();
    const { toast } = useToast();
    const previousStatus = useRef<boolean | null>(null);

    useEffect(() => {
        // No mostrar notificación en el primer render
        if (previousStatus.current === null) {
            previousStatus.current = isOnline;
            return;
        }

        // Solo notificar si el estado cambió
        if (previousStatus.current !== isOnline) {
            if (isOnline) {
                toast({
                    title: '🌐 Conexión restaurada',
                    description: 'La aplicación está nuevamente en línea.',
                    duration: 3000,
                });
            } else {
                toast({
                    title: '📴 Modo sin conexión',
                    description: 'La aplicación funciona completamente offline. Todos tus datos se guardan localmente.',
                    duration: 5000,
                });
            }
            previousStatus.current = isOnline;
        }
    }, [isOnline, toast]);

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
