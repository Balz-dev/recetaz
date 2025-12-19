
import { MousePointer2, ClipboardEdit, Printer } from "lucide-react";

/**
 * Sección de pasos visuales v2.
 */
export function VisualSteps() {
  const steps = [
    {
      icon: <MousePointer2 className="w-8 h-8" />,
      title: "Configura",
      description: "Define dónde va el nombre, la fecha y el tratamiento en tu hoja membretada."
    },
    {
      icon: <ClipboardEdit className="w-8 h-8" />,
      title: "Captura",
      description: "Selecciona al paciente y los medicamentos frecuentes de tu catálogo personal."
    },
    {
      icon: <Printer className="w-8 h-8" />,
      title: "Entrega",
      description: "Imprime directamente o genera un PDF profesional para enviar por WhatsApp."
    }
  ];

  return (
    <section className="py-32 px-6 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 italic tracking-tight underline decoration-blue-500 underline-offset-8">Tres pasos. <br />Cero fricción.</h2>
                <p className="text-xl text-slate-400">RecetaZ no es un software médico pesado. Es tu aliada silenciosa en cada consulta.</p>
            </div>
            <div className="text-blue-500 font-mono text-sm hidden md:block">FLOW_SEQUENCE_v2.0</div>
        </div>

        <div className="grid md:grid-cols-3 gap-16 relative">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              <div className="mb-8 w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                {step.icon}
              </div>
              <div className="space-y-4">
                <span className="text-slate-600 font-mono text-xs tracking-widest uppercase">Paso 0{index + 1}</span>
                <h3 className="text-2xl font-bold italic">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed font-light text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
