
import { Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

/**
 * Sección de Precios.
 * Destaca el Lifetime Deal.
 */
export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Precios Simples</h2>
          <p className="text-xl text-slate-600">Empieza gratis, crece cuando lo necesites.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          
          {/* Plan Free */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gratis</h3>
            <p className="text-slate-500 text-sm mb-6">Perfecto para probar</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> 50 recetas al mes</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Impresión Híbrida</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Plantilla básica</li>
            </ul>
             <Link href="/demo">
                <Button variant="outline" className="w-full">Empezar Gratis</Button>
             </Link>
          </div>

          {/* Lifetime Deal - Destacado */}
          <div className="p-8 rounded-2xl border-2 border-blue-600 bg-blue-50/50 relative shadow-xl transform scale-105 z-10">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MÁS POPULAR
            </div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Lifetime Deal</h3>
            <p className="text-slate-500 text-sm mb-6">Pago único, acceso de por vida</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-bold text-slate-900">$1,500</span>
              <span className="text-slate-500 font-medium">MXN</span>
            </div>
            <p className="text-xs text-slate-500 mb-6 bg-white p-2 rounded border border-blue-100">
              Oferta de lanzamiento limitada. Incluye todas las actualizaciones futuras.
            </p>
            <ul className="space-y-4 mb-8 text-sm text-slate-700 font-medium">
              <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> <strong>Recetas ILIMITADAS</strong></li>
              <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> Impresión Híbrida Pro</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> Soporte Prioritario WhatsApp</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-blue-600" /> Sin pagos mensuales nunca</li>
            </ul>
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
              Obtener Acceso de Por Vida
            </Button>
          </div>

          {/* Plan Pro */}
          <div className="p-8 rounded-2xl border border-slate-200 bg-white">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Pro Mensual</h3>
            <p className="text-slate-500 text-sm mb-6">Para consultorios activos</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">$299</span>
              <span className="text-slate-500">/mes</span>
            </div>
            <ul className="space-y-4 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Recetas ILIMITADAS</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Impresión Híbrida</li>
              <li className="flex items-center gap-3"><Check size={18} className="text-green-500" /> Soporte por email</li>
            </ul>
            <Button variant="outline" className="w-full">Suscribirse</Button>
          </div>

        </div>
      </div>
    </section>
  );
}
