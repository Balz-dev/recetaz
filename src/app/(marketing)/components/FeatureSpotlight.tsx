
"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Printer, FileText } from "lucide-react";

/**
 * Sección destacar característica: Smart Print.
 * Incluye demo interactivo de impresión híbrida.
 */
export function FeatureSpotlight() {
  const [mode, setMode] = useState<"blank" | "letterhead">("letterhead");

  return (
    <section id="features" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Contenido */}
        <div className="order-2 lg:order-1">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold mb-6">
            Smart Print Technology ™
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            La "Máquina de Escribir" Inteligente.
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Configura tus márgenes una sola vez. Nuestro sistema imprime los datos exactamente donde los necesitas, respetando tu logotipo y diseño actual. 
            <br/><br/>
            ¿No tienes hojas membretadas? No hay problema, imprimimos el diseño completo por ti.
          </p>
          
          <div className="flex flex-col gap-4">
             <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                    <Printer size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">Ahorra Tinta y Papel</h4>
                    <p className="text-slate-600 text-sm">Usa tus propias hojas. Imprimimos solo el texto negro necesario.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">Sin atascos ni errores</h4>
                    <p className="text-slate-600 text-sm">Previsualización real antes de imprimir. Lo que ves es lo que obtienes.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Demo Interactivo */}
        <div className="order-1 lg:order-2 bg-slate-900 rounded-2xl p-8 shadow-2xl relative">
            {/* Controles del toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-800 p-1 rounded-lg inline-flex relative">
                    {/* Fondo animado del toggle (opcional, simplificado aquí) */}
                    <button 
                        onClick={() => setMode("blank")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'blank' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Hoja Blanca
                    </button>
                    <button 
                        onClick={() => setMode("letterhead")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'letterhead' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Hoja Membretada
                    </button>
                </div>
            </div>

            {/* Visualización de la Hoja */}
            <div className="bg-slate-800/50 p-4 rounded-xl overflow-hidden relative">
                <div className="aspect-[3/4] bg-white w-3/4 mx-auto rounded shadow-lg relative transition-all duration-500 flex flex-col p-8">
                    
                    {/* Header: Solo visible en modo Blank o si se simula el papel pre-impreso de forma tenue */}
                    <div className={`transition-opacity duration-500 mb-8 border-b-2 border-slate-100 pb-4 flex justify-between items-center ${mode === 'letterhead' ? 'opacity-30 blur-[1px] saturate-0' : 'opacity-100'}`}>
                        <div className="flex items-center gap-2">
                             <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">Dr</div>
                             <div>
                                 <h3 className="font-bold text-slate-900 text-sm leading-tight">Dr. Juan Pérez</h3>
                                 <p className="text-xs text-slate-500">Medicina General</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400">Av. Siempre Viva 123</p>
                            <p className="text-[10px] text-slate-400">CED. 12345678</p>
                        </div>
                    </div>

                    {/* Contenido (Siempre se imprime) */}
                    <div className="flex-1 font-mono text-sm text-slate-900 space-y-4">
                        <div className="flex justify-between text-xs text-slate-500 border-b border-dashed border-slate-200 pb-2">
                            <span>Paciente: Ana García</span>
                            <span>Fecha: 12 Oct 2025</span>
                        </div>
                        
                        <div className="space-y-4 pt-2">
                            <div>
                                <p className="font-bold mb-1">1. Amoxicilina 500mg</p>
                                <p className="text-slate-600 pl-4 text-xs">Tomar 1 cápsula cada 8 horas por 7 días.</p>
                            </div>
                            <div>
                                <p className="font-bold mb-1">2. Paracetamol 500mg</p>
                                <p className="text-slate-600 pl-4 text-xs">Tomar 1 tableta cada 8 horas en caso de dolor o fiebre.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Firma */}
                    <div className="mt-8 pt-8 text-center relative">
                        <div className="w-32 mx-auto border-t border-slate-900 h-1"></div>
                        <p className="text-xs text-slate-400 mt-1">Firma del Médico</p>
                    </div>

                    {/* Etiqueta flotante */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                         {mode === 'letterhead' && (
                             <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm whitespace-nowrap">
                                 Simulando tu papel real (No se imprime fondo)
                             </div>
                         )}
                    </div>

                </div>
            </div>
            
            <p className="text-center text-slate-400 text-sm mt-4">
                {mode === 'blank' ? 'Se imprime TODO el diseño.' : 'Solo se imprimen los datos clínicos.'}
            </p>
        </div>

      </div>
    </section>
  );
}
