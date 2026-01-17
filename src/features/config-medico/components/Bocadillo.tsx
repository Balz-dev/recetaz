import React from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

interface BocadilloProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom';
}

/**
 * Componente de globo de texto (Bocadillo) para la Dra. Zoyla.
 */
export function Bocadillo({ children, className, direction = 'left' }: BocadilloProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={cn(
                "relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border-2 border-blue-100 dark:border-blue-900/50 text-slate-700 dark:text-slate-200",
                "before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white dark:before:bg-slate-800 before:border-b-2 before:border-r-2 before:border-blue-100 dark:before:border-blue-900/50",
                {
                    // Pico a la izquierda (para cuando Dra. Zoyla está a la izquierda)
                    "before:left-[-9px] before:top-8 before:rotate-[135deg]": direction === 'left',
                    // Pico a la derecha
                    "before:right-[-9px] before:top-8 before:-rotate-45": direction === 'right',
                    // Pico arriba
                    "before:top-[-9px] before:left-1/2 before:-translate-x-1/2 before:-rotate-[135deg]": direction === 'top',
                    // Pico abajo
                    "before:bottom-[-9px] before:left-1/2 before:-translate-x-1/2 before:rotate-45": direction === 'bottom',
                },
                className
            )}
        >
            {children}
        </motion.div>
    );
}
