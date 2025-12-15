import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Recetaz - Software Médico para Doctores Modernos",
    description: "Gestiona tus recetas médicas de forma rápida, segura y elegante.",
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="antialiased bg-white text-slate-900">
                <main className="min-h-screen flex flex-col">
                    {children}
                </main>
            </body>
        </html>
    );
}
