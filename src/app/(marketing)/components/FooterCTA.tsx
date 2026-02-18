/**
 * Componente de CTA (Call to Action) final para la landing page.
 * Incluye seguimiento de eventos para medir la conversión de demo vs prueba gratis.
 */

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMetrics } from "@/shared/hooks/useMetrics";

export function FooterCTA() {
    const { trackMarketing } = useMetrics();

    return (
        <section className="py-24 bg-blue-600 dark:bg-blue-700 relative overflow-hidden">
            {/* Fondo con textura sutil */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center text-white">
                <h2 className="text-3xl sm:text-6xl font-extrabold mb-6 tracking-tighter text-balance">
                    Menos tiempo en administración. Más tiempo para tus pacientes.
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
                    Deja de formatear recetas. Enfócate en tus pacientes.
                    <strong> 14 días gratis, sin tarjetas.</strong>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Botón Secundario - Demo/Sandbox */}
                    <Link
                        href="/demo"
                        onClick={() => trackMarketing('lp_demo_requested', { location: 'footer' })}
                        className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border-2 border-white/30 bg-transparent px-10 py-5 text-xl font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                    >
                        Probar Demo Interactiva
                    </Link>
                    {/* Botón Principal - Dashboard/App Real */}
                    <Link
                        href="/dashboard"
                        onClick={() => trackMarketing('lp_footer_cta_clicked')}
                        className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-xl font-bold text-blue-600 hover:bg-slate-50 transition-all shadow-2xl hover:shadow-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                    >
                        Comenzar mi prueba gratuita
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <p className="mt-6 text-sm text-blue-100 opacity-90 text-pretty">
                    <span className="font-semibold">Demo:</span> Explora con datos de ejemplo, sin registro. <span className="mx-2">•</span> <span className="font-semibold">Prueba Gratis:</span> 14 días con tus datos reales.
                </p>
                <p className="mt-8 text-sm text-blue-100 opacity-80 text-pretty">
                    Sin instalación compleja. Funciona directamente en tu navegador.
                </p>
            </div>

            {/* Decoración premium */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-white rounded-full mix-blend-soft-light filter blur-[140px] opacity-20 motion-safe:animate-pulse"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-20"></div>
        </section>
    );
}
