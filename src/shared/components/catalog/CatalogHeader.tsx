/**
 * @fileoverview Componente de encabezado reutilizable para páginas de catálogo
 * 
 * Muestra el título, descripción y botón de acción principal
 * de las páginas de catálogo (medicamentos, diagnósticos, etc.)
 */

import { Button } from '@/shared/components/ui/button'
import { LucideIcon } from 'lucide-react'

/**
 * Props del componente CatalogHeader
 */
interface CatalogHeaderProps {
    /** Título de la página */
    title: string
    /** Descripción de la página */
    description: string
    /** Texto del botón principal (opcional) */
    buttonText?: string
    /** Callback al hacer clic en el botón (opcional) */
    onButtonClick?: () => void
    /** Icono del botón (opcional) */
    ButtonIcon?: LucideIcon
}

/**
 * Componente de encabezado para páginas de catálogo
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX con el encabezado
 */
export function CatalogHeader({
    title,
    description,
    buttonText,
    onButtonClick,
    ButtonIcon
}: CatalogHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {description}
                </p>
            </div>
            {buttonText && onButtonClick && (
                <Button onClick={onButtonClick} className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700">
                    {ButtonIcon && <ButtonIcon className="h-4 w-4" />}
                    {buttonText}
                </Button>
            )}
        </div>
    )
}
