import "../globals.css";

/**
 * Layout aislado para la ruta de demo personalizada por slug.
 * Mantiene separación visual y estructural con el resto de la aplicación.
 *
 * @param props.children - Contenido de la página del preset.
 * @returns Estructura HTML/body mínima para la pantalla de carga.
 */
export default function DemoSlugLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="antialiased bg-slate-100">
                {children}
            </body>
        </html>
    );
}
