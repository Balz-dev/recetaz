import { Shield, Lock, HardDrive, FileCheck, MapPin } from "lucide-react"

/**
 * Sección de confianza y seguridad.
 * Enfatiza privacidad, cumplimiento COFEPRIS y control de datos.
 */
export function TrustSection() {
    const trustPoints = [
        {
            icon: <Lock className="h-6 w-6 text-blue-600" />,
            title: "Encriptación de datos: AES-256",
            description: "Tus datos están protegidos con el mismo nivel de seguridad que usan los bancos."
        },
        {
            icon: <Shield className="h-6 w-6 text-blue-600" />,
            title: "Cumplimiento COFEPRIS",
            description: "Diseñado siguiendo las normas mexicanas de protección de datos médicos sensibles."
        },
        {
            icon: <MapPin className="h-6 w-6 text-blue-600" />,
            title: "Offline-first: Funciona sin internet",
            description: "No dependas de conexión para atender a tus pacientes. Todo funciona localmente."
        },
        {
            icon: <FileCheck className="h-6 w-6 text-blue-600" />,
            title: "Hecho por médicos, para médicos",
            description: "Entendemos tu flujo de trabajo porque hemos estado en tu lugar."
        },
        {
            icon: <HardDrive className="h-6 w-6 text-blue-600" />,
            title: "Sin dependencia de servidores",
            description: "Tus datos, tu control. La información se queda en tu dispositivo, no en nuestra nube."
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-br from-blue-500/5 to-slate-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden" id="trust">
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl opacity-20 -z-0" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-3xl opacity-20 -z-0" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                🔒 Privacidad y Seguridad Garantizada
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                        Tus datos médicos están <span className="text-blue-600 dark:text-blue-500">100% seguros</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Entendemos la responsabilidad legal y ética de manejar información médica sensible. Por eso RecetaZ fue diseñado con privacidad desde el inicio.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                    {trustPoints.map((point, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <div className="text-blue-600 dark:text-blue-500">
                                        {point.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                        {point.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {point.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mensaje de tranquilidad */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 max-w-3xl mx-auto text-center text-sm">
                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                        <span className="font-bold text-blue-600 dark:text-blue-500">Promesa RecetaZ:</span> Nunca venderemos, compartiremos ni accederemos a tus datos médicos.
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                        Tú tienes el control absoluto. Tus pacientes confían en ti, y tú puedes confiar en RecetaZ.
                    </p>
                </div>
            </div>
        </section>
    )
}
