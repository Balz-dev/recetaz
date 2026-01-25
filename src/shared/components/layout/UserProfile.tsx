'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    LogOut,
    AlertCircle,
    MessageSquare,
    ShieldCheck,
    RefreshCcw,
    ChevronUp,
    ChevronDown,
    Settings
} from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
    icon?: LucideIcon;
    label?: string;
    color?: string;
    bg?: string;
    action?: () => void;
    isDanger?: boolean;
    separator?: boolean;
}

interface UserProfileProps {
    /** Indica si el sidebar está colapsado */
    isCollapsed?: boolean;
    /** Clase adicional para el contenedor */
    className?: string;
}

/**
 * Componente que muestra el perfil del usuario (médico) con un menú desplegable personalizado.
 * Implementa las opciones solicitadas: Reportar fallo, Solicitar funcionalidad, 
 * Datos de licencia, Actualizar y Cerrar Sesión.
 * 
 * @param props - Propiedades del componente.
 * @returns Componente JSX con el perfil de usuario.
 */
export function UserProfile({ isCollapsed, className }: UserProfileProps) {
    const { user, signOut, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar el menú al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isAuthenticated) return null;

    const displayName = user?.user_metadata?.nombre || user?.email?.split('@')[0] || 'Médico';
    const firstLetter = displayName.charAt(0).toUpperCase();

    const menuItems: MenuItem[] = [
        { icon: AlertCircle, label: 'Reportar un fallo', color: 'text-amber-500', bg: 'hover:bg-amber-500/10' },
        { icon: MessageSquare, label: 'Solicitar funcionalidad', color: 'text-cyan-500', bg: 'hover:bg-cyan-500/10' },
        { separator: true },
        { icon: ShieldCheck, label: 'Datos de licencia', color: 'text-emerald-500', bg: 'hover:bg-emerald-500/10' },
        { icon: RefreshCcw, label: 'Actualizar', color: 'text-blue-500', bg: 'hover:bg-blue-500/10' },
        { separator: true },
        { icon: LogOut, label: 'Cerrar sesión', color: 'text-red-500', bg: 'hover:bg-red-500/10', action: signOut, isDanger: true },
    ];

    return (
        <div className={cn("mt-auto relative", className)} ref={menuRef}>
            {/* Menú Desplegable (Pop-up) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                            "absolute z-[100] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 w-64",
                            isCollapsed ? "left-full bottom-0 ml-4" : "left-0 bottom-full mb-3"
                        )}
                    >
                        <div className="px-4 py-2 border-b border-slate-800 mb-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Centro de Ayuda y Cuenta
                            </p>
                        </div>

                        {menuItems.map((item, idx) => (
                            item.separator ? (
                                <div key={`sep-${idx}`} className="h-px bg-slate-800 my-1 mx-2" />
                            ) : (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        item.action?.();
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group text-left",
                                        item.bg || "hover:bg-slate-800",
                                        item.isDanger ? "hover:text-red-400" : "hover:text-white"
                                    )}
                                >
                                    {item.icon && <item.icon size={18} className={cn("shrink-0", item.color)} />}
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-inherit">
                                        {item.label}
                                    </span>
                                </button>
                            )
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center w-full p-2 rounded-xl transition-all duration-200 outline-none",
                    "hover:bg-slate-800 group",
                    isOpen ? "bg-slate-800" : "",
                    isCollapsed ? "justify-center" : "gap-3"
                )}
            >
                {/* Avatar */}
                <div className={cn(
                    "flex items-center justify-center rounded-lg font-bold text-white shadow-lg shrink-0",
                    "bg-gradient-to-br from-blue-500 to-cyan-500",
                    "w-10 h-10 text-base"
                )}>
                    {user?.user_metadata?.avatar_url ? (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt={displayName}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        firstLetter
                    )}
                </div>

                {/* Info (Solo si no está colapsado) */}
                {!isCollapsed && (
                    <div className="flex flex-col items-start overflow-hidden text-left flex-1">
                        <span className="text-sm font-semibold text-slate-200 truncate w-full">
                            {displayName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Médico Verificado
                        </span>
                    </div>
                )}

                {/* Flecha Indicator */}
                {!isCollapsed && (
                    <div className="ml-auto text-slate-500 group-hover:text-slate-300 transition-colors">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </div>
                )}
            </button>
        </div>
    );
}
