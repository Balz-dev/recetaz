import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Términos de Servicio | RecetaZ",
    description: "Consulta los términos y condiciones de uso de RecetaZ. Herramienta de productividad para médicos independientes.",
};

/**
 * Página de Términos de Servicio.
 * Define la responsabilidad del usuario y las limitaciones del software.
 */
export default function TerminosPage() {
    return (
        <div className="py-20 bg-white dark:bg-slate-900 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
                    Términos de <span className="text-blue-600">Servicio</span>
                </h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400">
                    <section>
                        <p className="text-lg leading-relaxed">
                            Bienvenido a RecetaZ. Al utilizar nuestra plataforma, aceptas los siguientes términos y condiciones. Por favor, léelos cuidadosamente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Naturaleza del Servicio</h2>
                        <p>
                            RecetaZ es una herramienta de <strong>productividad y gestión administrativa</strong> para consultorios médicos.
                            El software está diseñado para facilitar la creación, impresión y organización de recetas médicas y expedientes básicos.
                        </p>
                        <p className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm">
                            <strong>Nota Importante:</strong> RecetaZ NO es un sistema de Receta Electrónica con Firma Electrónica Avanzada (FEA) bajo certificaciones específicas de COFEPRIS para la venta de medicamentos controlados. Es una herramienta para imprimir sobre formatos físicos o generar documentos informativos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Responsabilidad Profesional</h2>
                        <p>
                            El uso de RecetaZ no sustituye el juicio clínico del profesional de la salud. El Usuario (médico) es el
                            <strong> único responsable</strong> de la exactitud de los diagnósticos, las dosis recetadas y la veracidad de la información del paciente. RecetaZ no se hace responsable por errores médicos derivados de información ingresada incorrectamente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Propiedad de la Información</h2>
                        <p>
                            Toda la información clínica es propiedad exclusiva del Usuario. RecetaZ proporciona la infraestructura tecnológica local para gestionarla, pero el Usuario es el responsable legal de custodiar dicha información conforme a la
                            <strong> NOM-004-SSA3-2012</strong> (del expediente clínico) y la Ley Federal de Protección de Datos Personales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Licencia y Uso</h2>
                        <p>
                            Otorgamos una licencia de uso personal, no exclusiva y revocable para utilizar RecetaZ según el plan contratado. Queda prohibido el uso de la plataforma para fines ilícitos, ingeniería inversa o cualquier actividad que comprometa la integridad del servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Limitación de Responsabilidad</h2>
                        <p>
                            RecetaZ se proporciona "tal cual". Al ser una aplicación que almacena datos localmente, RecetaZ no se hace responsable por la pérdida de información debido a fallos en el dispositivo del usuario, borrado de caché del navegador o falta de respaldos por parte del médico.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-slate-200 dark:border-slate-800 text-sm italic">
                        <p>Última actualización: 18 de febrero de 2026. El uso continuo de la plataforma después de cualquier cambio en estos términos constituye la aceptación de los mismos.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
