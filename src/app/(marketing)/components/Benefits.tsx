
import { BookOpen, History, ShieldCheck, Zap } from "lucide-react";

/**
 * Sección de beneficios adicionales.
 */
export function Benefits() {
  const benefits = [
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      title: "Vademécum Inteligente",
      description: "Escribe 'Para...' y te sugerimos 'Paracetamol'. Autocompletado de dosis y frecuencias comunes para ahorrar clics."
    },
    {
      icon: <History className="w-6 h-6 text-white" />,
      title: "Expediente Express",
      description: "Guarda automáticamente a tus pacientes. Replica una receta anterior con un solo clic en su próxima visita."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Seguridad y Cumplimiento",
      description: "Cumple con los requisitos normativos (Cédula, dirección, firma digital). Tus datos están seguros y locales."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
