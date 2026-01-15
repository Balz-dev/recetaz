/**
 * @fileoverview Componente de tarjetas de estadísticas reutilizable
 * 
 * Muestra tarjetas con estadísticas numéricas en un grid responsive
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { LucideIcon } from 'lucide-react'

/**
 * Configuración de una tarjeta de estadística
 */
export interface StatCard {
    /** Título de la estadística */
    title: string
    /** Valor numérico de la estadística */
    value: number
    /** Icono opcional para la tarjeta */
    icon?: LucideIcon
}

/**
 * Props del componente StatsCards
 */
interface StatsCardsProps {
    /** Array de estadísticas a mostrar */
    stats: StatCard[]
}

/**
 * Componente de tarjetas de estadísticas
 * 
 * @param props - Propiedades del componente
 * @returns Grid de tarjetas con estadísticas
 */
export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
