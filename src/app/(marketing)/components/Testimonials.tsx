"use client";

import { Star, Quote } from "lucide-react";
import { useMetrics } from "@/shared/hooks/useMetrics";

/**
 * Datos ficticios de testimonios para demostración social.
 */
const testimonials = [
    {
        name: "Dr. Alejandro Rivera",
        specialty: "Médico General",
        location: "CDMX",
        text: "RecetaZ cambió por completo mi consulta. Antes tardaba minutos formateando en Word, ahora mis recetas están listas en segundos. El autocompletado es magia pura.",
        rating: 5
    },
    {
        name: "Dra. Sofía Martínez",
        specialty: "Pediatría",
        location: "Guadalajara",
        text: "Lo que más valoro es que funciona sin internet. En mi consultorio la conexión es inestable, pero con RecetaZ nunca me detengo. Mis pacientes aman el nuevo diseño de mis recetas.",
        rating: 5
    },
    {
        name: "Dr. Miguel Ángel Torres",
        specialty: "Ginecología",
        location: "Monterrey",
        text: "La transición desde Word fue inmediata. Es tan intuitivo que no necesité tutorial. El control de mis ganancias diarias también me ha ayudado mucho a organizarme.",
        rating: 5
    },
    {
        name: "Dra. Elena Vázquez",
        specialty: "Dermatología",
        location: "Puebla",
        text: "Mis recetas ahora se ven súper profesionales. Pude subir mi logotipo y ajustar los campos exactamente donde los necesitaba para mis hojas membretadas.",
        rating: 5
    },
    {
        name: "Dr. Ricardo Santos",
        specialty: "Medicina Interna",
        location: "Querétaro",
        text: "La seguridad es mi prioridad. Saber que los datos de mis pacientes se quedan en mi computadora y no en una nube desconocida me da mucha tranquilidad legal.",
        rating: 5
    },
    {
        name: "Dra. Carmen Luna",
        specialty: "Nutrición",
        location: "Mérida",
        text: "Excelente herramienta. El buscador de medicamentos me ahorra mucho tiempo y evita errores. Es el mejor aliado para cualquier médico independiente en México.",
        rating: 5
    }
];

/**
 * Componente de Testimonios para la Landing Page.
 * Muestra experiencias ficticias de médicos usando RecetaZ.
 * 
 * @returns Componente JSX con la sección de testimonios.
 */
export function Testimonials() {
    const { trackMarketing } = useMetrics();

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 overflow-hidden" id="testimonios">
            <div className="container mx-auto px-4 sm:px-6 relative">
                {/* Decoraciones de fondo */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

                <div className="text-center mb-16 relative z-10">
                    <div className="inline-block mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest">
                                Testimonios
                            </span>
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Lo que dicen <span className="text-blue-600 dark:text-blue-500">nuestros médicos</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Cientos de médicos en México ya están optimizando su tiempo y profesionalizando sus consultas con RecetaZ.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col group"
                            onClick={() => trackMarketing('lp_testimonial_viewed', { doctor: t.name })}
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, starI) => (
                                    <Star key={starI} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <div className="relative mb-6">
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-500/10 -z-0" />
                                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed relative z-10">
                                    "{t.text}"
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-700 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg border border-blue-200/50 dark:border-blue-700/50 shadow-inner">
                                    {t.name.charAt(0)}
                                    {t.name.split(' ')[1]?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                        {t.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        {t.specialty} • {t.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
