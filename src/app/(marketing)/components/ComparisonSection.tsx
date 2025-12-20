import { XCircle, CheckCircle2, FileText } from "lucide-react"

/**
 * Sección comparativa entre el flujo tradicional (Word) y RecetaZ.
 * Visualiza el desorden vs el orden.
 * 
 * @returns Componente JSX con la comparativa.
 */
export function ComparisonSection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-[#0F172A]/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ¿Por qué dejar de usar Word?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            El flujo tradicional consume tiempo valioso que podrías dedicar a tus pacientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Lado Word - Negativo */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-red-100 dark:border-red-900/30 shadow-xl shadow-red-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="h-24 w-24 text-red-500" />
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Formas Tradicionales</h3>
            </div>
            
            <ul className="space-y-4">
              {[
                "Buscar archivos viejos para copiar datos",
                "Escribir manualmente el nombre del paciente",
                "Errores de formato al imprimir",
                "Perder el historial de lo que recetaste",
                "Dificultad para recordar dosis frecuentes"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-slate-600 dark:text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm font-medium text-red-500 italic">
              "Tardas 5-10 minutos por cada receta..."
            </div>
          </div>

          {/* Lado RecetaZ - Positivo */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle2 className="h-24 w-24 text-blue-500" />
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Con RecetaZ</h3>
            </div>
            
            <ul className="space-y-4">
              {[
                "Selecciona pacientes en un clic",
                "Base de datos de medicamentos frecuentes",
                "Impresión perfecta en tu receta membretada",
                "Historial completo por paciente",
                "Vista de ingresos y consultas semanales"
              ].map((item, i) => (
                <li key={i} className="flex items-start text-slate-600 dark:text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm font-medium text-blue-600 italic">
              "Genera tu receta en menos de 1 minuto."
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
