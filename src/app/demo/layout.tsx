import "../globals.css";

export default function DemoLayout({
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
