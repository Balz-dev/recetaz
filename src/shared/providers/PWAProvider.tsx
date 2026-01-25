/**
 * @fileoverview Proveedor de Contexto para la PWA.
 * 
 * Permite que toda la aplicación acceda al estado de instalación
 * y coordinación del PWA Install Gate.
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useMetrics } from '@/shared/hooks/useMetrics';

export type InstallGateState = 'FULL' | 'LIMITED' | null;

interface PWAContextType {
    isInstalled: boolean;
    deferredPrompt: any;
    gateState: InstallGateState;
    installApp: () => Promise<void>;
    dismissGate: () => void;
    isIOS: boolean;
    hasPrompt: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const { track, trackMarketing } = useMetrics();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [gateState, setGateState] = useState<InstallGateState>(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detectar iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Detectar si ya está instalada
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            track('pwa_already_installed', { mode: 'standalone' }, 'technical');
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            trackMarketing('pwa_install_prompt_available');
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setGateState(null);
            trackMarketing('pwa_installed_successfully');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    /**
     * Inicia el flujo de instalación de la PWA.
     * 
     * Si el navegador ha capturado un evento `beforeinstallprompt` (Chrome/Android),
     * lo utiliza para mostrar el aviso nativo.
     * Si el usuario rechaza, se puede optar por mostrar un estado limitado (feedback).
     */
    const installApp = useCallback(async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setGateState(null);
            trackMarketing('pwa_install_accepted');
        } else {
            setGateState('LIMITED');
            trackMarketing('pwa_install_rejected');
        }
    }, [deferredPrompt]);

    const dismissGate = useCallback(() => {
        setGateState('LIMITED');
    }, []);

    return (
        <PWAContext.Provider value={{
            isInstalled,
            deferredPrompt,
            gateState,
            installApp,
            dismissGate,
            isIOS,
            hasPrompt: !!deferredPrompt
        }}>
            {children}
        </PWAContext.Provider>
    );
}

export function usePWA() {
    const context = useContext(PWAContext);
    if (context === undefined) {
        // Fallback para componentes fuera del provider o durante SSR
        return {
            isInstalled: false,
            deferredPrompt: null,
            gateState: null,
            installApp: async () => { },
            dismissGate: () => { },
            isIOS: false,
            hasPrompt: false
        };
    }
    return context;
}
