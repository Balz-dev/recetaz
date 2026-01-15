/**
 * @fileoverview Componente que gestiona la visibilidad del modal de instalación PWA.
 * 
 * Basado en el estado del gateState de usePWA, muestra una invitación
 * de pantalla completa o un banner discreto.
 */

"use client";

import React from 'react';
import { usePWA } from '@/shared/hooks/usePWA';
import { Button } from '@/shared/components/ui/button';
import {
    Download,
    Smartphone,
    X,
    Info,
    Share,
    Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallGate() {
    const { gateState, installApp, dismissGate, isIOS, hasPrompt } = usePWA();

    if (!gateState) return null;

    if (gateState === 'FULL') {
        return (
            <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                    <div className="bg-blue-600 p-8 flex justify-center">
                        <div className="bg-white/20 p-4 rounded-3xl">
                            <Smartphone size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="p-8 space-y-6 text-center">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Instale RecetaZ</h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Para una mejor experiencia, mayor velocidad y acceso sin internet, instale nuestra aplicación.
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            {hasPrompt ? (
                                <Button className="w-full h-12 text-lg font-bold gap-2" onClick={installApp}>
                                    <Download size={20} />
                                    Instalar Ahora
                                </Button>
                            ) : isIOS ? (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-left space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                                        <Info size={16} />
                                        <span>Instrucciones para iPhone</span>
                                    </div>
                                    <ol className="space-y-2 text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-2">
                                            1. Toca el botón <strong>Compartir</strong> <Share size={16} className="inline" />
                                        </li>
                                        <li className="flex items-center gap-2">
                                            2. Baja y busca <strong>"Añadir a pantalla de inicio"</strong> <PlusSquare size={16} className="inline" />
                                        </li>
                                    </ol>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">
                                    Si no ve el botón de instalación, busque la opción en el menú de su navegador.
                                </p>
                            )}

                            <Button variant="ghost" className="w-full text-slate-400" onClick={dismissGate}>
                                Seguir en el navegador
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (gateState === 'LIMITED') {
        return (
            <div className="fixed top-0 left-0 right-0 z-[100] bg-blue-600 text-white py-2 px-4 shadow-lg animate-in slide-in-from-top duration-500">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Smartphone size={18} className="shrink-0" />
                        <p className="text-sm font-medium truncate">Instala la app para trabajar sin internet</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasPrompt && (
                            <Button size="sm" variant="secondary" className="h-8 py-0 px-3 text-blue-600 font-bold" onClick={installApp}>
                                Instalar
                            </Button>
                        )}
                        <button onClick={dismissGate} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

// Re-importing PlusSquare since it's used in the iOS instructions
import { PlusSquare } from 'lucide-react';
