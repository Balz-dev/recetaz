import React from 'react';
import { cn } from "@/shared/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const PRESET_COLORS = [
    '#000000', // Negro
    '#4b5563', // Gris Oscuro
    '#9ca3af', // Gris Claro
    '#dc2626', // Rojo
    '#d97706', // Naranja
    '#059669', // Verde
    '#2563eb', // Azul
    '#7c3aed', // Violeta
    '#db2777', // Rosa
];

interface SelectorColorProps {
    color?: string;
    onChange: (color: string) => void;
    className?: string;
}

/**
 * Selector de color con paleta predefinida y selector personalizado nativo.
 */
export function SelectorColor({ color = '#000000', onChange, className }: SelectorColorProps) {
    // Si no tenemos Popover, usaremos un dropdown simple con estado local
    // PERO, como detectamos que NO EXISTE Popover en la lista de archivos,
    // implementaremos una versión simplificada usando un div relativo y estado. 
    // *UPDATE*: En mi plan prometí "Popover simple o dropdown". 
    // Voy a implementar un dropdown custom aquí mismo para evitar dependencias faltantes
    // ya que vi que popover.tsx no estaba en la lista de archivos.

    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative inline-block", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded border border-slate-200 shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
                title="Cambiar color"
            >
                {/* Visual feedback borderline if white/transparent */}
                {color.toLowerCase() === '#ffffff' && <div className="w-full h-full border border-slate-300 rounded" />}
            </button>

            {isOpen && (
                <div
                    className="absolute top-full mt-2 left-0 z-[60] bg-white rounded-lg shadow-xl border border-slate-100 p-3 w-[180px] animate-in fade-in zoom-in-95 duration-100"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div className="grid grid-cols-5 gap-2 mb-3">
                        {PRESET_COLORS.map((c) => (
                            <button
                                key={c}
                                className={cn(
                                    "w-6 h-6 rounded-full border border-slate-100 hover:scale-110 transition-transform relative",
                                    color === c && "ring-2 ring-blue-500 ring-offset-1"
                                )}
                                style={{ backgroundColor: c }}
                                onClick={() => {
                                    onChange(c);
                                    setIsOpen(false);
                                }}
                            >
                                {color === c && <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-md" />}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center gap-2 pt-2 border-t border-slate-100">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:opacity-90">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => onChange(e.target.value)}
                                className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
                            />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Personalizado</span>
                    </div>
                </div>
            )}
        </div>
    );
}
