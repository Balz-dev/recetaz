import { Info } from "lucide-react"

/**
 * Sección de aclaración sobre qué es y qué no es RecetaZ.
 * Ayuda a posicionar el producto y reducir fricción.
 */
export function Philosophy() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl flex-shrink-0">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                ¿Para quién es RecetaZ?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                RecetaZ está diseñado para el <strong>médico independiente en México</strong> que valora su tiempo. No queremos que aprendas a usar un sistema complejo ni que cambies tu forma de trabajar.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-xs">Lo que SÍ es</h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                       <span className="text-green-500 font-bold">✓</span> Una herramienta de productividad
                    </li>
                    <li className="flex items-center gap-2">
                       <span className="text-green-500 font-bold">✓</span> Un diseñador de recetas membretadas
                    </li>
                    <li className="flex items-center gap-2">
                       <span className="text-green-500 font-bold">✓</span> Privado, rápido y offline
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-xs">Lo que NO es</h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                       <span className="text-red-500 font-bold">✕</span> No es un expediente clínico pesado
                    </li>
                    <li className="flex items-center gap-2">
                       <span className="text-red-500 font-bold">✕</span> No es receta electrónica oficial
                    </li>
                    <li className="flex items-center gap-2">
                       <span className="text-red-500 font-bold">✕</span> No requiere internet para funcionar
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
