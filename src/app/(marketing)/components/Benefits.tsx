
import { Zap, FileText, LayoutDashboard } from "lucide-react";

/**
 * Sección de beneficios clave enfocada en el valor del mundo real.
 * 
 * @returns Componente React de Beneficios.
 */
export function Benefits() {
  const items = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Ahorra tiempo en consulta",
      description: "No vuelvas a escribir lo mismo. Selecciona medicamentos frecuentes y dosis sugeridas en segundos."
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Usa tu propia receta",
      description: "Tú diseñas la plantilla una sola vez para que imprima exactamente sobre tu papelería membretada actual."
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-white" />,
      title: "Ten orden y control",
      description: "Mira cuántos pacientes atendiste y cuánto has generado por semana desde un panel simple y claro."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-start group">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
