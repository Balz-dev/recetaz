/**
 * @fileoverview Proveedor de Contexto para la PWA.
 * 
 * Permite que toda la aplicación acceda al estado de instalación
 * y coordinación del PWA Install Gate.
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Si no está instalada, mostramos el gate FULL
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                setGateState('FULL');
            }
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setGateState(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = useCallback(async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setGateState(null);
        } else {
            setGateState('LIMITED');
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
