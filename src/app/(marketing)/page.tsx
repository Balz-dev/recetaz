import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function MarketingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-blue-50 to-white">
            <h1 className="text-5xl font-extrabold tracking-tight text-blue-900 mb-6">
                Recetaz
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mb-10">
                La plataforma moderna para gestión de recetas médicas.
                Optimiza tu consultorio con tecnología offline-first.
            </p>
            <div className="flex gap-4">
                <Link href="/demo">
                    <Button size="lg" variant="outline">Ver Demo</Button>
                </Link>
                <Link href="/dashboard">
                    <Button size="lg">Ir a la App</Button>
                </Link>
            </div>
            <footer className="mt-20 text-sm text-slate-400">
                © 2025 Recetaz Inc.
            </footer>
        </div>
    );
}
