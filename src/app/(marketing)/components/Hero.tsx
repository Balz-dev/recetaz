
"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Printer, FileText, Laptop } from "lucide-react";

/**
 * Sección Hero principal.
 * Muestra la propuesta de valor y captura de leads.
 */
export function Hero() {
  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Contenido de Texto */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium border border-blue-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nueva función: Impresión Híbrida
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tu receta lista en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">30 segundos</span>.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            La herramienta más simple para médicos que quieren dejar de escribir a mano sin desperdiciar sus hojas membretadas ni pelear con Word.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200/50">
              Crear receta gratis <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          
          <p className="text-sm text-slate-500">
            No requiere tarjeta de crédito • Plan gratuito disponible
          </p>
        </div>

        {/* Visual Hero */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 overflow-hidden">
            <div className="bg-slate-50 rounded-xl p-8 relative overflow-hidden aspect-[4/3] flex items-center justify-center">
                 {/* Representación Abstracta de la Impresión Híbrida */}
                 <div className="grid grid-cols-2 gap-8 w-full">
                    {/* Lado Físico */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center gap-4 relative">
                        <div className="absolute top-2 left-2 text-xs font-bold text-slate-400">REALIDAD</div>
                        <Printer className="w-12 h-12 text-slate-300" />
                        <div className="w-24 h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-white relative">
                             <div className="w-full h-full absolute inset-0 bg-blue-50/30"></div> 
                             <p className="text-[0.5rem] text-center text-slate-400 px-2">Hoja Membretada Existente</p>
                        </div>
                    </div>
                    {/* Lado Digital */}
                    <div className="bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-800 flex flex-col items-center gap-4 relative text-white">
                         <div className="absolute top-2 left-2 text-xs font-bold text-slate-500">APP</div>
                        <Laptop className="w-12 h-12 text-blue-400" />
                        <div className="w-24 h-32 bg-slate-800 rounded flex flex-col p-2 gap-1">
                            <div className="h-2 w-1/2 bg-slate-600 rounded"></div>
                            <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                            <div className="h-full"></div>
                             <div className="h-8 w-full bg-blue-600/20 border border-blue-500/50 rounded flex items-center justify-center">
                                <span className="text-[0.4rem] text-blue-300">Datos calibrados</span>
                             </div>
                        </div>
                    </div>
                 </div>

                 {/* Conector */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-2 rounded-full shadow-lg border border-slate-100 z-10">
                         <ArrowRight className="w-6 h-6 text-blue-600" />
                    </div>
                 </div>
            </div>
          </div>
          
          {/* Elementos decorativos de fondo */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}
