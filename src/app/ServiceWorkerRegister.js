// ServiceWorkerRegister.js
"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
    useEffect(() => {
        console.log('🚀 ServiceWorkerRegister component mounted');

        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator
        ) {
            console.log('✓ Service Worker API available');
            console.log('✓ Registering SW immediately...');

            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker registered successfully:', registration.scope);
                    console.log('✅ Registration:', registration);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 Service Worker update found');

                        newWorker.addEventListener('statechange', () => {
                            console.log('🔄 SW State:', newWorker.state);
                            if (newWorker.state === 'activated') {
                                console.log('✅ New Service Worker activated');
                            }
                        });
                    });
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        } else {
            console.log('⚠️ Service Workers not supported in this browser');
        }
    }, []);

    return null;
}
