"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useMetrics } from "@/shared/hooks/useMetrics";

/**
 * Sección de precios de RecetaZ.
 *
 * @returns Componente JSX con los planes de precios.
 */
export function Pricing() {
  const { trackMarketing } = useMetrics();
  const plans = [
    {
      name: "Plan Básico",
      price: "$149",
      yearlyPrice: "$1,490",
      period: "/ mes",
      yearlyPeriod: "/ año",
      description: "Ideal para médicos que quieren dejar de usar Word en sus recetas.",
      features: [
        "Editor de plantillas ilimitado",
        "Gestión de pacientes, medicamentos, diagnósticos",
        "Autocompletado inteligente",
        "Almacenamiento local encriptado",
        "Backup manual",
        "Soporte por email"
      ],
      cta: "Comenzar gratis",
      href: "/dashboard",
      highlighted: false
    },
    {
      name: "Plan PRO",
      price: "$299",
      yearlyPrice: "$2,990",
      period: "/ mes",
      yearlyPeriod: "/ año",
      description: "Para médicos que buscan máxima seguridad y funciones avanzadas.",
      features: [
        "Todo lo del Básico, más:",
        "✨ Backup automático a Google Drive",
        "✨ Soporte técnico prioritario",
        "✨ Diseño de plantilla asistido",
        "✨ Acceso anticipado a nuevas funciones"
      ],
      cta: "Probar Plan PRO",
      href: "/dashboard",
      highlighted: true,
      badge: "Más popular"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0F172A]" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Precios claros, sin sorpresas
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
          Periodo de prueba: 14 días gratis, sin tarjeta de crédito.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${plan.highlighted
                ? "border-blue-600 bg-white dark:bg-slate-900 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 shadow-xl"
                }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xl text-slate-500 ml-1">
                    MXN{plan.period}
                  </span>
                </div>
                <div className="mt-2 text-sm text-blue-600 font-semibold">
                  {plan.yearlyPrice} MXN{plan.yearlyPeriod} (2 meses gratis)
                </div>
              </div>

              <ul className="space-y-4 mb-10 text-left flex-1">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center text-slate-600 dark:text-slate-400"
                  >
                    <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                onClick={() => trackMarketing('lp_pricing_interacted', { plan: plan.name })}
                className={`w-full inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-bold transition-all active:scale-95 ${plan.highlighted
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-slate-500 dark:text-slate-500 text-sm">
          ¿Necesitas algo a la medida para un hospital grande?{" "}
          <Link
            href="#"
            className="text-blue-600 font-semibold hover:underline"
          >
            Contáctanos
          </Link>
        </p>
      </div>
    </section>
  );
}
