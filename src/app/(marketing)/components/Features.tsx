import { Sparkles, Brain, Lock, FileEdit, TrendingUp, HardDrive } from "lucide-react"

/**
 * Sección de características principales de RecetaZ.
 * Enfocada en los beneficios específicos y dolores que resuelve para médicos.
 */
export function Features() {
  const features = [
    {
      icon: <FileEdit className="h-6 w-6 text-blue-600" />,
      title: "Editor de Plantillas Visual",
      pain: "¿Cansado de formatear en Word?",
      description: "Sube tu receta membretada o elige una de nuestra galería. Arrastra campos donde quieras. Diseña una vez, usa siempre.",
      benefit: "Ahorra 2+ horas diarias"
    },
    {
      icon: <Brain className="h-6 w-6 text-blue-600" />,
      title: "Autocompletado Inteligente",
      pain: "¿Repetir datos de medicamentos, diagnósticos y pacientes cada vez?",
      description: "El sistema aprende tus patrones. Escribe 'gastro...' y sugiere el tratamiento que usaste antes. Un click y listo.",
      benefit: "Más tiempo a tu consulta, menos al generar la receta"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      title: "Asociación Diagnóstico-Medicamento",
      pain: "¿Qué recetaste la última vez?",
      description: "RecetaZ asocia automáticamente diagnósticos con medicamentos. Selecciona 'Cólera' y aparecen los medicamentos que usaste.",
      benefit: "Cero errores de memoria"
    },
    {
      icon: <Lock className="h-6 w-6 text-blue-600" />,
      title: "Privacidad Total (COFEPRIS)",
      pain: "¿Preocupado por datos en la nube?",
      description: "Todo se guarda localmente en tu dispositivo con encriptación AES-256. Tú eres el único con acceso. Cumplimiento garantizado.",
      benefit: "Tranquilidad legal"
    },
    {
      icon: <HardDrive className="h-6 w-6 text-blue-600" />,
      title: "Backup Automático (PRO)",
      pain: "¿Miedo a perder información?",
      description: "Respaldos periódicos a tu Google Drive personal, como WhatsApp. Configura la frecuencia y olvídate.",
      benefit: "Nunca pierdas datos"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      title: "Dashboard Financiero",
      pain: "¿Cuánto ganaste este mes?",
      description: "Visualiza tus ingresos por día, semana o mes. Basado en el precio fijo de tu consulta y número de pacientes.",
      benefit: "Control total de finanzas"
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-slate-800" id="features">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Características que <span className="text-blue-600 dark:text-blue-500">optimizan tu consulta</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Cada función está diseñada para eliminar una fricción específica de tu día a día con elegancia y profesionalismo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-slate-50/50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 dark:hover:border-blue-500/30 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:scale-110 shadow-sm transition-all duration-300">
                <div className="group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
                {feature.pain}
              </p>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-blue-600">
                  ✨ {feature.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
