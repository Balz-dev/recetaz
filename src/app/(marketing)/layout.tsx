import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "RecetaZ - Deja de hacer recetas en Word",
    description: "La forma más simple para médicos en México que quieren dejar de usar Word para sus recetas.",
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
