import { Shield, Lock, HardDrive, FileCheck, MapPin } from "lucide-react"

/**
 * Sección de confianza y seguridad.
 * Enfatiza privacidad, cumplimiento COFEPRIS y control de datos.
 */
export function TrustSection() {
    const pillars = [
        {
            icon: <Shield className="h-8 w-8 text-blue-600" />,
            title: "Privacidad por Diseño",
            points: [
                "Almacenamiento 100% local en tu dispositivo.",
                "Sin bases de datos compartidas ni servidores centrales.",
                "Tú eliges cuándo y dónde respaldar tu información."
            ]
        },
        {
            icon: <Lock className="h-8 w-8 text-blue-600" />,
            title: "Protección de Grado Clínico",
            points: [
                "Encriptación AES-256 para todos tus datos médicos.",
                "Protocolos alineados a normativas de salud internacional.",
                "Acceso restringido únicamente mediante tu sesión local."
            ]
        },
        {
            icon: <MapPin className="h-8 w-8 text-blue-600" />,
            title: "Autonomía Total",
            points: [
                "Funcionamiento offline: nunca dependas del Wi-Fi.",
                "ADN Médico: entendemos el rigor clínico.",
                "Sin licencias restrictivas ni dependencia de la nube."
            ]
        }
    ]

    return (
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden" id="trust">
            {/* Elementos decorativos de fondo sutiles */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full ring-1 ring-blue-100 dark:ring-blue-800">
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                Control Total y Privacidad
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Tus datos <span className="text-blue-600 dark:text-blue-500">nunca salen de tu control</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        En el sector médico, la privacidad no es opcional. RecetaZ no es una "nube"; es una herramienta local diseñada para darte total propiedad sobre tu información.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-16">
                    {pillars.map((pillar, i) => (
                        <div
                            key={i}
                            className="bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all duration-300 group"
                        >
                            <div className="mb-6 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                                {pillar.title}
                            </h3>
                            <ul className="space-y-4">
                                {pillar.points.map((point, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                                            {point}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* La Promesa RecetaZ - Rediseñada para Impacto */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-[2.5rem] p-1 shadow-2xl shadow-blue-500/20">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.3rem] p-8 sm:p-12 text-center">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                La Promesa <span className="text-blue-600 font-black">RecetaZ</span>
                            </h3>
                            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed max-w-2xl mx-auto">
                                "Nunca venderemos, compartiremos ni tendremos acceso a tus datos médicos o de pacientes. Tu información es <span className="font-bold underline decoration-blue-500/30 underline-offset-4">sagrada y privada.</span>"
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                                <FileCheck className="w-5 h-5" />
                                <span>Garantía de Soberanía Digital</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
