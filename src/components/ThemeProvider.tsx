"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * Proveedor de temas para manejar el modo claro y oscuro.
 * 
 * @param props - Propiedades del proveedor.
 * @returns Componente envoltorio con el contexto de tema.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
