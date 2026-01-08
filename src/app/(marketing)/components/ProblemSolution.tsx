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
            solution: "Autocompletado inteligente",
            benefit: "Más tiempo a tu consulta, menos al generar la receta"
        },
        {
            problem: "Recordar qué medicamento recetaste",
            pain: "¿Cuál antibiótico usé para gastroenteritis?",
            solution: "El sistema aprende tus patrones",
            benefit: "Sugiere tratamientos basados en diagnóstico"
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
            benefit: "Cumplimiento COFEPRIS garantizado"
        },
        {
            problem: "Sin respaldo de información crítica",
            pain: "Un error y pierdes todo el historial",
            solution: "Backup automático (PRO)",
            benefit: "Como WhatsApp: seguro y transparente"
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Los dolores que <span className="text-slate-500">atrasan tu consulta</span> vs{" "}
                        <span className="text-blue-600 dark:text-blue-500">tu flujo con RecetaZ</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Conocemos tu frustración diaria. Por eso creamos RecetaZ.
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 max-w-6xl mx-auto">
                    {comparisons.map((item, index) => (
                        <div
                            key={index}
                            className="grid md:grid-cols-2 gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                        >
                            {/* Problema */}
                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                            {item.problem}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                            "{item.pain}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Solución */}
                            <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                            {item.solution}
                                        </h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                            ✨ {item.benefit}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                        <span className="font-bold text-blue-600 dark:text-blue-500">Miles de médicos</span> ya dejaron atrás estos dolores.
                    </p>
                </div>
            </div>
        </section>
    )
}
