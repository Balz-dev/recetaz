import { Upload, MousePointer, Zap } from "lucide-react"

/**
 * Sección "Cómo funciona" en 3 pasos simples.
 * Enfatiza la facilidad de uso y el flujo de trabajo del médico.
 */
export function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      number: "1",
      title: "Diseña tu plantilla (una sola vez)",
      description: "Sube la imagen de tu receta membretada y arrastra los campos donde deben aparecer los datos. O personaliza una plantilla de nuestra galería profesional.",
      time: "5 minutos, una sola vez"
    },
    {
      icon: <MousePointer className="h-8 w-8 text-blue-600" />,
      number: "2",
      title: "Llena el formulario en cada consulta",
      description: "Datos del paciente con autocompletado, diagnóstico con sugerencias inteligentes, medicamentos asociados. El sistema aprende tus patrones.",
      time: "30 segundos por paciente"
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      number: "3",
      title: "Imprime o guarda PDF",
      description: "RecetaZ genera el PDF con tu diseño exacto. Imprime en tu receta membretada o guarda digitalmente. Historial automático del paciente.",
      time: "Instantáneo"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-y border-slate-100 dark:border-slate-800" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Tan simple que <span className="text-blue-600 dark:text-blue-500">lo dominas en minutos</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sin curvas de aprendizaje complicadas. Sin capacitación. Diseñado para médicos ocupados.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative max-w-6xl mx-auto">
          {/* Línea conectora */}
          <div className="hidden md:block absolute top-20 left-0 w-full h-[2px] bg-gradient-to-r from-blue-100 via-blue-400 to-blue-100 dark:from-blue-900/30 dark:via-blue-700 dark:to-blue-900/30 -z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              {/* Número del paso */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20 z-20">
                {step.number}
              </div>

              <div className="w-full bg-white dark:bg-slate-800 p-8 pt-12 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group-hover:-translate-y-2">
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 w-16 h-16 mx-auto flex items-center justify-center rounded-2xl group-hover:bg-blue-600 group-hover:scale-110 shadow-sm transition-all duration-300">
                  <div className="group-hover:text-white transition-colors">
                    {/* Restauramos el color del icono en el hover si es necesario, pero aquí el grupo maneja el cambio a blanco */}
                    <div className="text-blue-600">
                      {step.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                  {step.description}
                </p>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    ⏱️ {step.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje final */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            <span className="font-bold text-blue-600 dark:text-blue-500">Total de configuración:</span> Menos de 10 minutos. <span className="font-bold text-blue-600 dark:text-blue-500">Ahorro por día:</span> 2+ horas.
          </p>
        </div>
      </div>
    </section>
  )
}
