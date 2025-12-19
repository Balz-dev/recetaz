import { Layout, Users, FileCheck } from "lucide-react"

/**
 * Sección "Cómo funciona" en 3 pasos simples.
 * 
 * @returns Componente JSX con el flujo de uso.
 */
export function HowItWorks() {
  const steps = [
    {
      icon: <Layout className="h-8 w-8 text-blue-600" />,
      title: "Diseña tu receta",
      description: "Sube tu logo y acomoda los campos para que coincidan con tu hoja membretada física."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Captura al paciente",
      description: "Registra los datos básicos una sola vez. RecetaZ los recordará en la siguiente consulta."
    },
    {
      icon: <FileCheck className="h-8 w-8 text-blue-600" />,
      title: "Genera la receta",
      description: "Selecciona los medicamentos, las dosis y dale a imprimir. Así de fácil."
    }
  ]

  return (
    <section className="py-20 bg-white dark:bg-[#0F172A]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Funciona exactamente como tú quieres
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Sin complicaciones, sin sistemas médicos pesados. Solo tú y tus recetas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Línea conectora visible en desktop */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-blue-100 dark:border-blue-800 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
