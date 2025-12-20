import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

/**
 * Sección de precios de RecetaZ.
 *
 * @returns Componente JSX con los planes de precios.
 */
export function Pricing() {
  const plans = [
    {
      name: "Médico Individual",
      price: "$149",
      yearlyPrice: "$1,499",
      period: "/ mes",
      yearlyPeriod: "/ año",
      description: "Ideal para médicos que quieren dejar de usar Word en sus recetas.",
      features: [
        "Diseña tu propia receta membretada",
        "Genera recetas en segundos durante la consulta",
        "Guarda a tus pacientes sin límites",
        "Guarda tus medicamentos frecuentes",
        "Historial de pacientes, consultas y recetas",
        "Resumen semanal de consultas realizadas",
        "Úsalo desde tu computadora, tablet o celular",
        "Funciona incluso sin internet",
        "Soporte directo por WhatsApp"
      ],
      cta: "Usarlo en mi consultorio",
      href: "/demo",
      highlighted: true,
      badge: "Más popular"
    },
    {
      name: "Consultorio Pro",
      price: "$299",
      yearlyPrice: "$2,999",
      period: "/ mes",
      yearlyPeriod: "/ año",
      description: "Para consultorios que comparten equipo o trabajan con asistentes.",
      features: [
        "Sincroniza tu información en todos tus dispositivos",
        "Comparte la información del consultorio con asistentes",
        "Protección avanzada de la información de tus pacientes",
        "Exporta tu información a tu Google Drive",
        "Más opciones para personalizar tus recetas",
        "Análisis detallado de la actividad del consultorio",
        "Atención prioritaria"
      ],
      cta: "Mejorar mi consultorio",
      href: "/demo",
      highlighted: false
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0F172A]" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Precios claros, sin sorpresas
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
          Empieza gratis por 14 días. No requiere tarjeta de crédito.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                plan.highlighted
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
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-bold transition-all active:scale-95 ${
                  plan.highlighted
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
