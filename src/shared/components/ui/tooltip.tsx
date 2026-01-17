'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'right' | 'top' | 'bottom' | 'left';
    disabled?: boolean;
}

/**
 * Componente Tooltip sencillo para mostrar información al pasar el cursor.
 * 
 * @param content - El texto a mostrar en el tooltip.
 * @param children - El elemento que activará el tooltip.
 * @param position - La posición del tooltip respecto al elemento.
 * @param disabled - Si es verdadero, el tooltip no se mostrará.
 * @returns El componente Tooltip.
 */
export function Tooltip({ content, children, position = 'right', disabled = false }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    if (disabled) return <>{children}</>;

    const positionClasses = {
        right: 'left-full ml-2 top-1/2 -translate-y-1/2',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    };

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in duration-200",
                        positionClasses[position]
                    )}
                >
                    {content}
                    {/* Flecha del tooltip */}
                    <div
                        className={cn(
                            "absolute w-2 h-2 bg-slate-800 rotate-45",
                            position === 'right' && "-left-1 top-1/2 -translate-y-1/2",
                            position === 'left' && "-right-1 top-1/2 -translate-y-1/2",
                            position === 'top' && "-bottom-1 left-1/2 -translate-x-1/2",
                            position === 'bottom' && "-top-1 left-1/2 -translate-x-1/2"
                        )}
                    />
                </div>
            )}
        </div>
    );
}
