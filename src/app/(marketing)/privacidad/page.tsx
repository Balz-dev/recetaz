import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Aviso de Privacidad | RecetaZ",
    description: "Consulta nuestro aviso de privacidad. En RecetaZ, tus datos médicos son sagrados y permanecen bajo tu control total.",
};

/**
 * Página de Aviso de Privacidad.
 * Refleja la arquitectura offline-first y almacenamiento local del producto.
 */
export default function PrivacidadPage() {
    return (
        <div className="py-20 bg-white dark:bg-slate-900 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
                    Aviso de <span className="text-blue-600">Privacidad</span>
                </h1>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400">
                    <section>
                        <p className="text-lg leading-relaxed">
                            En RecetaZ, entendemos que la privacidad de los datos médicos es fundamental. Nuestra filosofía
                            tecnológica se basa en la <strong>Soberanía Digital del Médico</strong>: tú eres el único dueño de tu información.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Recolección de Datos</h2>
                        <p>
                            RecetaZ es una aplicación <strong>offline-first</strong>. Esto significa que toda la información clínica que registras (pacientes, diagnósticos, recetas) se guarda
                            exclusivamente de forma local en el almacenamiento de tu navegador o dispositivo mediante IndexedDB.
                            <strong> RecetaZ no tiene una base de datos centralizada donde se almacene tu información clínica.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Uso de la Información</h2>
                        <p>
                            La información clínica solo se utiliza para el funcionamiento de la aplicación en tu dispositivo.
                            Nosotros no vendemos, compartimos, ni procesamos tus datos médicos para fines publicitarios o de terceros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Servicios de Terceros (Respaldo)</h2>
                        <p>
                            Si decides activar la función de <strong>Respaldo en Google Drive</strong>, los datos encriptados se enviarán directamente desde tu navegador a tu cuenta personal de Google. RecetaZ no actúa como intermediario ni tiene acceso a las credenciales de tu cuenta de Google o al contenido de los archivos de respaldo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Métricas de Uso</h2>
                        <p>
                            Para mejorar el producto, recolectamos métricas técnicas y de uso de forma <strong>anónima</strong> (como qué secciones se visitan o errores técnicos). Estas métricas no incluyen nombres de pacientes, diagnósticos específicos ni datos que puedan identificarte a ti o a tus pacientes personalmente. Puedes desactivar las métricas de producto en cualquier momento desde la configuración.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Tus Derechos</h2>
                        <p>
                            Al ser los datos almacenados localmente, tienes control total sobre ellos. Puedes exportarlos, borrarlos o transferirlos limpiando los datos de tu navegador. Tienes el derecho absoluto al acceso, rectificación, cancelación y oposición (ARCO) sobre tu propia información.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-slate-200 dark:border-slate-800 text-sm italic">
                        <p>Última actualización: 18 de febrero de 2026. RecetaZ se reserva el derecho de actualizar este aviso para reflejar cambios en la tecnología o normativas vigentes.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
