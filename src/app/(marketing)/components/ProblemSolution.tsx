import { X, Check } from "lucide-react"

/**
 * Componente que muestra la comparación visual entre los problemas actuales
 * (Word/Excel) y las soluciones que ofrece RecetaZ.
 * Enfatiza los dolores específicos del médico y cómo RecetaZ los resuelve.
 */
export function ProblemSolution() {
    const comparisons = [
        {
            problem: "Formatear cada receta manualmente",
            pain: "Pierdes 5-10 minutos por paciente",
            solution: "Diseña una vez, usa siempre",
            benefit: "Ahorra 2+ horas diarias"
        },
        {
            problem: "Repetir datos de medicamentos, diagnósticos y pacientes",
            pain: "Escribir la misma información una y otra vez",
            solution: "Autocompletado de historial",
            benefit: "Más tiempo a tu consulta, menos al generar la receta"
        },
        {
            problem: "Recordar qué medicamento recetaste",
            pain: "¿Cuál antibiótico usé para gastroenteritis?",
            solution: "Recuerda datos previos",
            benefit: "Muestra medicamentos frecuentes"
        },
        {
            problem: "Usar diseños genéricos de otras apps",
            pain: "Pierdes tu identidad profesional",
            solution: "Tu membrete, tu marca",
            benefit: "Mantén tu imagen profesional"
        },
        {
            problem: "Otras apps guardan datos en la nube",
            pain: "Falta de control sobre información sensible",
            solution: "Tú tienes el control: local y encriptado",
            benefit: "Diseñado conforme a normativas"
        },
        {
            problem: "Sin respaldo de información crítica",
            pain: "Un error y pierdes todo el historial",
            solution: "Backup automático (PRO)",
            benefit: "Como WhatsApp: seguro y transparente"
        }
    ]

    return (
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" id="comparativa">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                        Los dolores <span className="text-slate-500">del pasado</span> vs{" "}
                        <span className="text-blue-600 dark:text-blue-500">tu flujo con RecetaZ</span>
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Optimizamos cada detalle para que dejes de perder tiempo en procesos administrativos obsoletos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {comparisons.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden group"
                        >
                            {/* Problema */}
                            <div className="p-5 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                        <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                                            {item.problem}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                            "{item.pain}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Solución */}
                            <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800 group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 leading-tight">
                                            {item.solution}
                                        </h4>
                                        <p className="text-[11px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                                            ✨ {item.benefit}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mensaje de cierre más directo */}
                <div className="text-center mt-10">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Diseñado para el médico que valora su <span className="font-bold text-blue-600">productividad</span>.
                    </p>
                </div>
            </div>
        </section>
    )
}
