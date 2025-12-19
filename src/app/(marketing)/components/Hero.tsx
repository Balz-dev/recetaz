import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"

/**
 * Sección Hero de la landing page.
 * Enfocada en atacar el dolor de usar Word para recetas.
 * 
 * @returns Componente JSX con el Hero.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Deja de hacer recetas en <span className="text-blue-600 dark:text-blue-500">Word</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Usa tu misma receta membretada, pero más rápido y ordenado. 
            Sin errores, sin repetir datos y con orden total en tu consultorio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              Usarlo en mi consultorio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Pruébalo ahora, sin registros complejos.
            </p>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Tus propias hojas membretadas
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Funciona sin internet
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Privacidad de datos garantizada
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-50 dark:opacity-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-700"></div>
      </div>
    </section>
  )
}
