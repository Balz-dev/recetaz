/**
 * @fileoverview Componente de filtros reutilizable para páginas de catálogo
 * 
 * Proporciona un campo de búsqueda y espacio para filtros personalizados
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Search } from 'lucide-react'
import { ReactNode } from 'react'

/**
 * Props del componente CatalogFilters
 */
interface CatalogFiltersProps {
    /** Valor actual de búsqueda */
    searchValue: string
    /** Callback al cambiar el valor de búsqueda */
    onSearchChange: (value: string) => void
    /** Placeholder del input de búsqueda */
    searchPlaceholder: string
    /** Filtros personalizados adicionales */
    children?: ReactNode
}

/**
 * Componente de filtros para páginas de catálogo
 * 
 * @param props - Propiedades del componente
 * @returns Tarjeta con campo de búsqueda y filtros personalizados
 */
export function CatalogFilters({
    searchValue,
    onSearchChange,
    searchPlaceholder,
    children
}: CatalogFiltersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {children}
                </div>
            </CardContent>
        </Card>
    )
}
