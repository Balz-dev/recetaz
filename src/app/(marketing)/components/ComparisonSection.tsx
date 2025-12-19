
import { X, Check, MonitorOff, Layout, History, FileText } from "lucide-react";

/**
 * Sección de comparación visual "Word vs RecetaZ".
 * Ataca el dolor de la ineficiencia.
 */
export function ComparisonSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">¿Por qué seguir luchando con Word?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hacer recetas no debería ser una tarea técnica de diseño gráfico.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* El Caos de Word */}
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-8">
            <div className="flex items-center gap-4 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold uppercase tracking-wider">Con Word</span>
            </div>
            <ul className="space-y-6">
                <li className="flex gap-4">
                    <MonitorOff className="w-6 h-6 text-slate-400 shrink-0" />
                    <p className="text-slate-600"><strong className="text-slate-900 block">Formato inestable.</strong> Agregas un medicamento y todo el diseño de tu hoja membretada salta a la siguiente página.</p>
                </li>
                <li className="flex gap-4">
                    <FileText className="w-6 h-6 text-slate-400 shrink-0" />
                    <p className="text-slate-600"><strong className="text-slate-900 block">El infinito copy-paste.</strong> Tienes que buscar recetas viejas, copiar, pegar y rezar para no dejar datos del paciente anterior.</p>
                </li>
                <li className="flex gap-4">
                    <X className="w-6 h-6 text-slate-400 shrink-0" />
                    <p className="text-slate-600"><strong className="text-slate-900 block">Cero inteligencia.</strong> Word no sabe cuál es la dosis de Paracetamol; tú tienes que escribir cada letra cada vez.</p>
                </li>
            </ul>
          </div>

          {/* La Claridad de RecetaZ */}
          <div className="p-8 rounded-3xl bg-blue-600 text-white space-y-8 shadow-2xl shadow-blue-200">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold uppercase tracking-wider">Con RecetaZ</span>
            </div>
            <ul className="space-y-6">
                <li className="flex gap-4">
                    <Layout className="w-6 h-6 text-blue-200 shrink-0" />
                    <p className="text-blue-50"><strong className="text-white block">Diseño inamovible.</strong> Tu plantilla está fija. Solo rellenas los datos y siempre sale perfecto en tu impresora.</p>
                </li>
                <li className="flex gap-4">
                    <History className="w-6 h-6 text-blue-200 shrink-0" />
                    <p className="text-blue-50"><strong className="text-white block">Historial inteligente.</strong> Busca al paciente por nombre y recupera su tratamiento en un clic. Sin errores.</p>
                </li>
                <li className="flex gap-4">
                    <Check className="w-6 h-6 text-blue-200 shrink-0" />
                    <p className="text-blue-50"><strong className="text-white block">Autocompletado médico.</strong> Escribe las primeras letras del medicamento y nosotros sugerimos el resto.</p>
                </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
