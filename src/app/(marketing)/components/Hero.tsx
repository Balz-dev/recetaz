"use client";

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useMetrics } from "@/shared/hooks/useMetrics"

/**
 * Sección Hero de la landing page.
 * Enfocada en atacar el dolor de usar Word para recetas e introducir la solución de RecetaZ.
 */
export function Hero() {
  const { trackMarketing } = useMetrics()
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Columna de Texto */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Gestiona tus recetas médicas en segundos, <span className="text-blue-600 dark:text-blue-500">con total control y seguridad</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-4 max-w-2xl lg:mx-0 mx-auto leading-relaxed">
              Diseña tu formato <span className="font-semibold text-slate-700 dark:text-slate-300">una sola vez</span> y reutiliza fácilmente la información que ya registraste. Ahorra tiempo en cada consulta sin comprometer la confidencialidad.
            </p>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl lg:mx-0 mx-auto">
              El sistema <span className="font-semibold">recuerda tus diagnósticos más frecuentes</span> y te facilita el autocompletado de pacientes y medicamentos. <span className="font-semibold text-blue-600 dark:text-blue-500">Un solo click</span> y listo.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 mb-4">
              {/* Botón Secundario - Demo/Sandbox */}
              <Link
                href="/demo"
                onClick={() => trackMarketing('lp_demo_requested', { location: 'hero' })}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 py-4 text-lg font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Probar Demo Interactiva
              </Link>

              {/* Botón Principal - Dashboard/App Real */}
              <Link
                href="/dashboard"
                onClick={() => trackMarketing('lp_hero_cta_clicked')}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              >
                Comenzar prueba gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>


            <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 text-center lg:text-left">
              <span className="font-semibold text-blue-600 dark:text-blue-500">Demo:</span> Explora con datos de ejemplo, sin registro. <span className="mx-2 hidden sm:inline">|</span> <span className="block sm:inline"><span className="font-semibold text-blue-600 dark:text-blue-500">Prueba Gratis:</span> 14 días con tus datos reales.</span>
            </p>

            <div className="flex flex-col gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center lg:justify-start justify-center">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                Funciona incluso sin internet
              </div>
              <div className="flex items-center lg:justify-start justify-center">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                Diseña tu receta una sola vez
              </div>
              <div className="flex items-center lg:justify-start justify-center">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                Atiende más rápido sin cambiar tu forma de trabajar
              </div>
            </div>
          </div>

          {/* Columna de Imagen */}
          <div className="flex-1 w-full max-w-3xl lg:max-w-none">
            <div className="relative rounded-xl shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Image
                src="/word-recetaz.png"
                alt="Comparación entre escribir recetas en Word y usar RecetaZ con formulario médico"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[140px] opacity-20 transition-all delay-700"></div>
      </div>
    </section>
  )
}
