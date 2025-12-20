import { Clock, ShieldCheck, Printer, History, BarChart3, CloudOff, Smartphone } from "lucide-react"

/**
 * Sección de beneficios principales de RecetaZ.
 * Enfocada en la productividad y simplicidad para el médico independiente.
 */
export function Features() {
  const features = [
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Ahorra tiempo en consulta",
      description: "Reduce el tiempo de escritura a menos de la mitad en cada paciente."
    },
    {
      icon: <CloudOff className="h-6 w-6 text-blue-600" />,
      title: "Funciona sin conexión",
      description: "No dependas del internet del consultorio. RecetaZ siempre está disponible."
    },
    {
      icon: <History className="h-6 w-6 text-blue-600" />,
      title: "No más repeticiones",
      description: "Los datos del paciente y sus medicamentos frecuentes se guardan automáticamente."
    },
    {
      icon: <Printer className="h-6 w-6 text-blue-600" />,
      title: "Tu diseño, tu receta",
      description: "Imprime sobre tus hojas membretadas actuales con absoluta precisión."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      title: "Control de actividad",
      description: "Visualiza cuántas consultas y qué ingresos has generado durante la semana."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      title: "Privacidad total",
      description: "Toda la información se guarda localmente. Tú tienes el control total de tus datos."
    }
  ]

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#0F172A]/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Diseñado para el médico independiente
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Pequeñas herramientas que hacen una gran diferencia en tu día a día, eliminando la fricción de los sistemas tradicionales.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
