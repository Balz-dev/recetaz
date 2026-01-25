/**
 * Banner de consentimiento para el uso de métricas.
 * Se muestra solo la primera vez y permite al médico aceptar o rechazar el tracking de producto.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, X, Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useMetricsConsent } from '../../providers/MetricsProvider';

export function ConsentBanner() {
    const { consent, updateConsent, isLoading } = useMetricsConsent();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Si no se ha actualizado nunca (o es la fecha por defecto), mostrar banner
        const hasDecided = localStorage.getItem('recetaz_metrics_decided') === 'true';
        if (!isLoading && !hasDecided) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, [isLoading]);

    const handleAcceptAll = async () => {
        await updateConsent({
            productMetrics: true,
            marketingMetrics: true,
        });
        closeBanner();
    };

    const handleOnlyTechnical = async () => {
        await updateConsent({
            productMetrics: false,
            marketingMetrics: false,
        });
        closeBanner();
    };

    const closeBanner = () => {
        setIsVisible(false);
        localStorage.setItem('recetaz_metrics_decided', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-6 right-6 z-[9999] md:left-auto md:right-8 md:max-w-md"
            >
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    <div className="flex gap-4 items-start mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                            <Shield size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 dark:text-white">Mejoramos para usted</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Usamos métricas anónimas para entender qué funciones le ahorran más tiempo y mejorar la app.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleAcceptAll} className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold">
                            <Check size={18} className="mr-2" />
                            Aceptar todo
                        </Button>
                        <Button onClick={handleOnlyTechnical} variant="ghost" className="flex-1 rounded-2xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                            Solo técnicas
                        </Button>
                    </div>

                    <p className="mt-4 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                        <Info size={10} />
                        Sus datos médicos nunca salen de este dispositivo.
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
