
"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Printer, Laptop } from "lucide-react";

/**
 * Sección Hero principal enfocada en el dolor del médico (Word).
 * 
 * @returns Componente React Hero.
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
            Diseñado para médicos en México
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Deja de hacer tus recetas en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Word</span>.
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Sigue usando tu misma receta membretada tradicional, pero genera el contenido en segundos sin que se mueva el formato.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200/50 text-lg px-8 h-14"
              onClick={() => window.location.href = '/demo'}
            >
              Probar Demo Gratis <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-sm text-slate-500">
            Sin instalaciones complejas • Úsalo en tus primeras consultas gratis
          </p>
        </div>

        {/* Visual Hero */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 overflow-hidden">
            <div className="bg-slate-50 rounded-xl p-8 relative overflow-hidden aspect-[4/3] flex items-center justify-center">
                 <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center gap-4 relative">
                        <div className="absolute top-2 left-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Lo de siempre</div>
                        <Printer className="w-12 h-12 text-slate-300" />
                        <div className="w-24 h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-white">
                             <p className="text-[0.5rem] text-center text-slate-400 px-2">Tu Hoja Membretada</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-800 flex flex-col items-center gap-4 relative text-white">
                         <div className="absolute top-2 left-2 text-xs font-bold text-slate-500 uppercase tracking-widest">RecetaZ</div>
                        <Laptop className="w-12 h-12 text-blue-400" />
                        <div className="w-24 h-32 bg-slate-800 rounded flex flex-col p-2 gap-1 overflow-hidden">
                            <div className="h-1.5 w-1/2 bg-slate-600 rounded"></div>
                            <div className="h-1.5 w-3/4 bg-slate-700 rounded"></div>
                            <div className="flex-1"></div>
                             <div className="h-6 w-full bg-blue-600/20 border border-blue-500/50 rounded flex items-center justify-center">
                                <span className="text-[0.4rem] text-blue-300">Datos precisos</span>
                             </div>
                        </div>
                    </div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-2 rounded-full shadow-lg border border-slate-100 z-10">
                         <ArrowRight className="w-6 h-6 text-blue-600" />
                    </div>
                 </div>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}
