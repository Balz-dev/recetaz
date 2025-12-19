
import { PencilLine, UserPlus, Printer } from "lucide-react";

/**
 * Sección explicativa del proceso simple de RecetaZ.
 */
export function HowItWorks() {
  const steps = [
    {
      icon: <PencilLine className="w-8 h-8 text-blue-600" />,
      title: "Diseña tu receta",
      description: "Configura el diseño de tu plantilla según tu hoja membretada una sola vez."
    },
    {
      icon: <UserPlus className="w-8 h-8 text-blue-600" />,
      title: "Captura al paciente",
      description: "Ingresa datos básicos y selecciona medicamentos de tu catálogo frecuente."
    },
    {
      icon: <Printer className="w-8 h-8 text-blue-600" />,
      title: "Imprime o guarda",
      description: "Genera la receta lista para imprimir o guardar como PDF al instante."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Empezar es más fácil que abrir Word
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Sin configuraciones eternas. Diseñado para médicos que valoran su tiempo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-blue-100 -z-0" />
          
          {steps.map((step, index) => (
            <div key={index} className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center z-10 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
