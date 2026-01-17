import React from 'react';
import { CampoPlantilla } from "@/types";
import { SelectorColor } from "./SelectorColor";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Copy, Type, Minus, Square, Bold, Edit2, Layers, ArrowUp, ArrowDown, Layout, Image as ImageIcon, RotateCcw, RotateCw } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

interface ToolbarPropiedadesProps {
    field: CampoPlantilla;
    onUpdate: (updates: Partial<CampoPlantilla>) => void;
    onDelete: () => void;
    onDuplicate?: () => void;
    onEdit?: () => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Barra de herramientas contextual que aparece cerca del elemento seleccionado.
 * Permite editar propiedades específicas (color, texto, etc.) y realizar acciones (eliminar).
 */
export function ToolbarPropiedades({ field, onUpdate, onDelete, onDuplicate, onEdit, containerRef }: ToolbarPropiedadesProps) {
    // Calculamos si debemos mostrar la toolbar arriba o abajo para evitar que se salga del canvas
    // Por defecto arriba. Si y < 15%, abajo.
    const positionStyle: React.CSSProperties = {
        left: `${field.x}%`,
        top: field.y < 15 ? `calc(${field.y}% + ${field.alto || 5}% + 10px)` : `calc(${field.y}% - 50px)`,
        transform: 'translateX(0)', // Alineado a la izquierda del elemento
    };

    // Ajuste para que no se salga por la derecha
    // Si x > 80%, movemos el anchor a la derecha
    const isRightAligned = field.x > 70;
    if (isRightAligned) {
        positionStyle.transform = 'translateX(-50%)'; // Un poco hacky, mejor logica de restriccion
        // Simplificación: usaremos left + translate.
        // Si está muy a la derecha, restamos ancho.
    }

    return (
        <div
            className="absolute z-[60] flex items-center gap-2 bg-white rounded-lg shadow-lg border border-slate-200 p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={positionStyle}
            onMouseDown={(e) => e.stopPropagation()} // Prevenir que el click deseleccione o inicie drag
            onPointerDown={(e) => e.stopPropagation()} // Prevenir eventos de DndKit
            onClick={(e) => e.stopPropagation()} // CRITICO: Prevenir que el click llegue al container y deseleccione (cerrando toolbar)
        >
            {/* Indicador de Tipo */}
            <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                {field.tipo === 'linea' && <Minus className="w-3 h-3" />}
                {field.tipo === 'cuadrado' && <Square className="w-3 h-3" />}
                {field.tipo === 'textoDecorativo' && <Type className="w-3 h-3" />}
                <span>{field.tipo === 'textoDecorativo' ? 'Texto' : (field.etiqueta || field.tipo)}</span>
            </div>

            {/* Botón Editar Texto */}
            {field.tipo === 'textoDecorativo' && onEdit && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-600 hover:bg-blue-50" onClick={onEdit} title="Editar Texto">
                    <Edit2 className="h-4 w-4" />
                </Button>
            )}

            {/* Separador */}
            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Selector de Color (Solo para elementos que lo usan) */}
            {field.tipo !== 'imagen' && (
                <SelectorColor
                    color={field.color}
                    onChange={(c) => onUpdate({ color: c })}
                />
            )}

            {/* Controles Específicos por Tipo */}
            {field.tipo === 'linea' && (
                <div className="flex items-center gap-1 mx-1" title="Grosor de línea">
                    <Select
                        value={String(field.grosor || 2)}
                        onValueChange={(val) => onUpdate({ grosor: Number(val) })}
                    >
                        <SelectTrigger className="h-8 w-[70px] text-xs px-2 border-slate-200">
                            <SelectValue placeholder="Grosor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1px</SelectItem>
                            <SelectItem value="2">2px</SelectItem>
                            <SelectItem value="4">4px</SelectItem>
                            <SelectItem value="6">6px</SelectItem>
                            <SelectItem value="8">8px</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Controles de Imagen */}
            {field.tipo === 'imagen' && (
                <>
                    {/* Fit/Cover Toggle */}
                    <div className="flex items-center gap-1 mx-1 border-l border-slate-200 pl-2">
                        <Button
                            variant={field.ajusteImagen === 'cover' ? "secondary" : "ghost"}
                            size="icon"
                            className="h-6 w-6 p-1"
                            onClick={() => onUpdate({ ajusteImagen: field.ajusteImagen === 'cover' ? 'contain' : 'cover' })}
                            title={field.ajusteImagen === 'cover' ? "Llenar (Recortar)" : "Ajustar (Completo)"}
                        >
                            {field.ajusteImagen === 'cover' ? <Layout className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                        </Button>
                    </div>

                    {/* Rotación */}
                    <div className="flex items-center gap-0.5 mx-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-1 text-slate-500 hover:text-blue-600"
                            onClick={() => {
                                const current = field.rotation || 0;
                                onUpdate({ rotation: (current - 90 + 360) % 360 });
                            }}
                            title="Rotar a la izquierda"
                        >
                            <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-1 text-slate-500 hover:text-blue-600"
                            onClick={() => {
                                const current = field.rotation || 0;
                                onUpdate({ rotation: (current + 90) % 360 });
                            }}
                            title="Rotar a la derecha"
                        >
                            <RotateCw className="h-3 w-3" />
                        </Button>
                    </div>
                </>
            )}

            {/* Selector Tamaño Fuente (Solo para elementos de texto) */}
            {field.tipo !== 'imagen' && field.tipo !== 'linea' && field.tipo !== 'cuadrado' && (
                <div className="flex items-center gap-1 mx-1 border-l border-slate-200 pl-2">
                    <Select
                        value={String(field.fontSize || 14)}
                        onValueChange={(val) => onUpdate({ fontSize: Number(val) })}
                    >
                        <SelectTrigger className="h-8 w-[60px] text-xs px-1 border-slate-200 gap-1">
                            <Type className="h-3 w-3 opacity-50" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 32, 48].map(size => (
                                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Control de Capas (Z-Index) */}
            <div className="flex gap-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-500 hover:text-blue-600"
                    onClick={() => onUpdate({ zIndex: (field.zIndex || 0) + 1 })}
                    title="Traer adelante"
                >
                    <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-500 hover:text-blue-600"
                    onClick={() => onUpdate({ zIndex: (field.zIndex || 0) - 1 })}
                    title="Enviar atrás"
                >
                    <ArrowDown className="h-4 w-4" />
                </Button>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* Acciones Generales */}
            {onDuplicate && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={onDuplicate} title="Duplicar">
                    <Copy className="w-4 h-4" />
                </Button>
            )}

            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={onDelete} title="Eliminar">
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}
