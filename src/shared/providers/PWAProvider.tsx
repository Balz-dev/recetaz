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
    installApp: () => Promise<'accepted' | 'dismissed' | null>;
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
        const inStandaloneMode = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
        if (inStandaloneMode) {
            setIsInstalled(true);
            track('pwa_already_installed', { mode: 'standalone' }, 'technical');
        }

        // Lógica Initial Check (para iOS o si el evento ya pasó)
        const checkInitialState = () => {
            const fullDismissed = localStorage.getItem('pwa_full_dismissed') === 'true';
            const limitedDismissed = localStorage.getItem('pwa_limited_dismissed') === 'true';

            if (inStandaloneMode || limitedDismissed) return;

            // En iOS forzamos el chequeo ya que no hay evento
            if (isIOSDevice) {
                setGateState(fullDismissed ? 'LIMITED' : 'FULL');
            }
        };

        checkInitialState();

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            trackMarketing('pwa_install_prompt_available');

            // LEER DE NUEVO localStorage para asegurar frescura
            const fullDismissed = localStorage.getItem('pwa_full_dismissed') === 'true';
            const limitedDismissed = localStorage.getItem('pwa_limited_dismissed') === 'true';
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

            // Si ya está instalada o ya se cerró el banner limitado, no hacer nada
            if (isStandalone || limitedDismissed) return;

            // Decidir qué mostrar según lo que el usuario haya cerrado antes
            setGateState(fullDismissed ? 'LIMITED' : 'FULL');
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setGateState(null);
            // Limpiar persistencia al instalar
            localStorage.removeItem('pwa_full_dismissed');
            localStorage.removeItem('pwa_limited_dismissed');
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
     */
    const installApp = useCallback(async () => {
        if (!deferredPrompt) {
            if (isIOS) setGateState('FULL');
            return null;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setGateState(null);
            localStorage.removeItem('pwa_full_dismissed');
            localStorage.removeItem('pwa_limited_dismissed');
            trackMarketing('pwa_install_accepted');
        } else {
            // Si rechaza el prompt del navegador, lo tratamos como dismissal del FULL gate
            localStorage.setItem('pwa_full_dismissed', 'true');
            setGateState('LIMITED');
            trackMarketing('pwa_install_rejected');
        }
        return outcome;
    }, [deferredPrompt, isIOS, trackMarketing]);

    const dismissGate = useCallback(() => {
        if (gateState === 'FULL') {
            localStorage.setItem('pwa_full_dismissed', 'true');
            setGateState('LIMITED');
        } else if (gateState === 'LIMITED') {
            localStorage.setItem('pwa_limited_dismissed', 'true');
            setGateState(null);
        }
    }, [gateState]);

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
            installApp: async () => null,
            dismissGate: () => { },
            isIOS: false,
            hasPrompt: false
        };
    }
    return context;
}
