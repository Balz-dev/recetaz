
import { X, Check } from "lucide-react";

/**
 * Sección de comparación Problema/Solución.
 * Destaca los puntos de dolor de las alternativas vs la solución de Recetaz.
 */
export function ProblemSolution() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            ¿Cansado de sistemas complejos?
          </h2>
          <p className="text-xl text-slate-600">
            Deja de luchar con herramientas que no fueron diseñadas para médicos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1: Software Tradicional */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
              <X size={24} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Software Tradicional</h3>
            <p className="text-slate-600 mb-6">Interfaces de los 90s, cientos de botones que no usas y costos mensuales elevados.</p>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Curva de aprendizaje alta</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Lento para cargar</li>
            </ul>
          </div>

          {/* Tarjeta 2: Word/Excel */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-600">
              <X size={24} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Word / Excel</h3>
            <p className="text-slate-600 mb-6">Se desconfigura al imprimir, copiar/pegar es riesgo de error y luce poco profesional.</p>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Sin historial de pacientes</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> No hay autocompletado</li>
            </ul>
          </div>

          {/* Tarjeta 3: Recetaz */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500 relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-lg">
              La Solución
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
              <Check size={28} strokeWidth={4} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Recetaz</h3>
            <p className="text-slate-600 mb-6">Diseñado para velocidad. Escribe, ajusta a tu papel e imprime. Sin complicaciones.</p>
            <ul className="space-y-3 text-sm text-slate-700 font-medium">
              <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Historial automático</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Calibración "Pixel Perfect"</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-blue-500" /> Autocompletado inteligente</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
