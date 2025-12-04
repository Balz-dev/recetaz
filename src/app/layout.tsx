import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegister from './ServiceWorkerRegister';
import Script from 'next/script';

export const metadata: Metadata = {
    title: "Recetas Médicas - Sistema de Gestión",
    description: "Sistema PWA para gestión de recetas médicas offline-first",
    manifest: "/manifest.json",
    themeColor: "#0066CC",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Recetas Médicas",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased h-screen overflow-hidden flex flex-col md:flex-row">
                {/* Sidebar para desktop - oculto en impresión */}
                <div className="hidden md:flex h-full print:hidden">
                    <Sidebar />
                </div>

                {/* Contenido principal */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header - oculto en impresión */}
                    <div className="print:hidden">
                        <Header />
                    </div>
                    <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-8 print:bg-white print:p-0">
                        {children}
                    </main>
                </div>
                <Toaster />
                <ServiceWorkerRegister />
                    {/* Fallback: ensure SW registration runs after interactive. This helps tests/CI
                        where the client component might not mount fast enough. */}
                    <Script id="sw-register" strategy="afterInteractive">
                        {`if(typeof navigator !== 'undefined' && 'serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(()=>{}); }`}
                    </Script>
            </body>
        </html>
    );
}
