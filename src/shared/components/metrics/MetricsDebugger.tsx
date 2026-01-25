/**
 * Componente de depuración para métricas.
 * Muestra los últimos eventos capturados y el estado de la cola de Dexie.
 * Solo debe usarse en entornos de desarrollo.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { metricsQueueDB } from '../../lib/metrics/queue';
import { Terminal, RefreshCcw, Database, AlertCircle } from 'lucide-react';

export function MetricsDebugger() {
    const [events, setEvents] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        if (!isOpen) return;

        const loadEvents = async () => {
            const allEvents = await metricsQueueDB.metricsQueue
                .orderBy('timestamp')
                .reverse()
                .limit(20)
                .toArray();
            setEvents(allEvents);
            setLastUpdate(new Date());
        };

        loadEvents();
        const interval = setInterval(loadEvents, 5000);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed top-4 right-4 z-[99999]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg transition-transform active:scale-95"
                title="Metrics Debugger"
            >
                <Terminal size={20} />
            </button>

            {isOpen && (
                <div className="mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 origin-top-right">
                    <div className="bg-slate-800 p-3 flex justify-between items-center border-b border-slate-700">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                            <Database size={14} />
                            Cola de Métricas
                        </span>
                        <span className="text-[10px] text-slate-500">
                            {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto p-2 space-y-2 bg-slate-900/50">
                        {events.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-xs italic">
                                No hay eventos en la cola local
                            </div>
                        ) : (
                            events.map((ev) => (
                                <div key={ev.id} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[10px] font-mono">
                                    <div className="flex justify-between mb-1">
                                        <span className={ev.synced ? "text-green-400" : "text-amber-400"}>
                                            [{ev.synced ? 'SINC' : 'PEND'}] {ev.type}
                                        </span>
                                        <span className="text-slate-500">
                                            {new Date(ev.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-slate-300 font-bold">{ev.name}</div>
                                    <pre className="mt-1 text-slate-500 max-h-20 overflow-auto scrollbar-hide">
                                        {JSON.stringify(ev.payload, null, 2)}
                                    </pre>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 bg-slate-800 flex justify-end">
                        <button
                            onClick={() => metricsQueueDB.metricsQueue.clear().then(() => setEvents([]))}
                            className="text-[10px] p-1 px-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
                        >
                            Limpiar Cola
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
