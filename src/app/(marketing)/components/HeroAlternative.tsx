
"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Hero v2: Enfoque en "Claridad Profesional".
 * Ataca el desorden de Word con una estética más limpia y minimalista.
 */
export function HeroAlternative() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden bg-[#0A0F1C] text-white">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>El estándar moderno para médicos en México</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1]">
          Tu receta merece algo <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">mejor que Word</span>.
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
          No más formatos que se mueven ni archivos perdidos. <br className="hidden md:block" />
          Organiza tu consulta con la elegancia que tus pacientes esperan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full text-xl px-12 h-16 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
            onClick={() => window.location.href = '/demo'}
          >
            Ver Demo en Vivo <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <p className="text-slate-500 text-lg">Prueba gratuita incluida</p>
        </div>

        {/* Mockup sutil de la app */}
        <div className="mt-20 relative px-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-2xl p-4 border-x border-t border-slate-700/50 shadow-2xl skew-x-1 rotate-1">
                <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="h-64 md:h-96 rounded-lg bg-slate-950/50 flex items-center justify-center border border-slate-800">
                    <div className="text-slate-700 font-mono text-sm">recetaz_dashboard_view.exe</div>
                </div>
            </div>
            {/* Resplandor inferior */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-[#0A0F1C] to-transparent z-20"></div>
        </div>
      </div>
    </section>
  );
}
