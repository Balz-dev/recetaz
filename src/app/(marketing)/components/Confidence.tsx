import { Shield, Clock, MousePointer2, WifiOff } from "lucide-react"

/**
 * Sección de confianza que destaca la adaptación de RecetaZ al entorno médico mexicano.
 */
export function Confidence() {
  const points = [
    {
      icon: <WifiOff className="h-6 w-6 text-blue-600" />,
      text: "Funciona incluso si el internet es inestable"
    },
    {
      icon: <MousePointer2 className="h-6 w-6 text-blue-600" />,
      text: "No cambia tu receta médica habitual"
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      text: "Tú mantienes el control de tu información"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      text: "Diseñado para médicos independientes"
    }
  ]

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Pensado para la realidad de los consultorios en México
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            RecetaZ no es un sistema clínico pesado. Es una herramienta ágil que se adapta a tu forma de trabajar, no al revés.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                {point.icon}
              </div>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
