import React from "react"
import "../globals.css"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { ThemeProvider } from "@/components/ThemeProvider"
import { MetricsProvider } from "@/shared/providers/MetricsProvider"
import { ConsentBanner } from "@/shared/components/metrics/ConsentBanner"

/**
 * Layout principal para la sección de marketing de RecetaZ.
 * 
 * @param props - Propiedades del componente.
 * @param props.children - Contenido de la página.
 * @returns Estructura básica con Header y Footer.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MetricsProvider>
            <div className="flex min-h-screen flex-col bg-white dark:bg-[#0F172A] transition-colors duration-300">
              <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                      <Image
                        src="/fenotipo.svg"
                        alt="Logo RecetaZ"
                        width={1214}
                        height={276}
                        className="h-8 w-auto"
                        priority
                      />
                    </span>
                  </Link>

                  <nav className="hidden md:flex items-center space-x-8">
                    <Link href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                      Funciones
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                      Cómo funciona
                    </Link>
                    <Link href="#trust" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                      Seguridad
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                      Precios
                    </Link>
                    <Link href="#faq" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                      FAQ
                    </Link>
                  </nav>

                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <ThemeToggle />
                    <Link
                      href="/demo"
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      Probar Demo
                    </Link>
                  </div>
                </div>
              </header>
              <main className="flex-1">
                {children}
              </main>
              <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-slate-50 dark:bg-[#0F172A]">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-500">
                        <Image
                          src="/fenotipo.svg"
                          alt="Logo RecetaZ"
                          width={1214}
                          height={276}
                          className="h-7 w-auto"
                        />
                      </span>
                      <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xs">
                        La forma más rápida y ordenada de hacer recetas médicas en México.
                        Adiós al Word, hola a la eficiencia.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Producto</h3>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><Link href="/demo" className="hover:text-blue-600 transition-colors">Demo</Link></li>
                        <li><Link href="#pricing" className="hover:text-blue-600 transition-colors">Precios</Link></li>
                        <li><Link href="#faq" className="hover:text-blue-600 transition-colors">Preguntas Frecuentes</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacidad</Link></li>
                        <li><Link href="#" className="hover:text-blue-600 transition-colors">Términos</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
                    © {new Date().getFullYear()} RecetaZ. Todos los derechos reservados.
                  </div>
                </div>
              </footer>
            </div>
          </MetricsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
