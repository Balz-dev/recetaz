/**
 * @fileoverview Componente reutilizable para acciones de tabla (editar/eliminar)
 * 
 * Proporciona botones consistentes para editar y eliminar elementos en tablas
 */

import { Button } from '@/shared/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

/**
 * Props del componente TableActions
 */
interface TableActionsProps {
    /** Callback al hacer clic en editar */
    onEdit: () => void
    /** Callback al hacer clic en eliminar */
    onDelete: () => void
    /** Texto alternativo para el botón de editar (accesibilidad) */
    editLabel?: string
    /** Texto alternativo para el botón de eliminar (accesibilidad) */
    deleteLabel?: string
}

/**
 * Componente de acciones para filas de tabla
 * 
 * @param props - Propiedades del componente
 * @returns Grupo de botones de acción (editar/eliminar)
 */
export function TableActions({
    onEdit,
    onDelete,
    editLabel = 'Editar',
    deleteLabel = 'Eliminar'
}: TableActionsProps) {
    return (
        <div className="flex justify-end gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                aria-label={editLabel}
            >
                <Pencil className="h-4 w-4 text-slate-500" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                aria-label={deleteLabel}
            >
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
        </div>
    )
}
