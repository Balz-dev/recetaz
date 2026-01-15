/**
 * @fileoverview Componente Badge (Etiqueta) reutilizable
 * 
 * Basado en los estilos de Shadcn UI para mostrar etiquetas con diferentes variantes
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
                success:
                    "border-transparent bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
                info:
                    "border-transparent bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10",
                slate:
                    "border-transparent bg-slate-100 text-slate-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

/**
 * Componente Badge para mostrar etiquetas
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX del Badge
 */
function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
