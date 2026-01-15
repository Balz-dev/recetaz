"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { seedDatabase } from "@/shared/utils/seed";

export default function DemoPage() {
    const router = useRouter();
    const [status, setStatus] = useState("Inicializando demo...");

    useEffect(() => {
        const initDemo = async () => {
            try {
                // Persistir modo demo en el navegador
                localStorage.setItem('recetaz_is_demo', 'true');

                setStatus("Limpiando y poblando base de datos...");

                // Ejecutar ssemilla real con datos demo
                await seedDatabase(true);

                setStatus("Datos cargados exitosamente.");

                // Breve pausa para que el usuario vea que terminó
                setTimeout(() => {
                    setStatus("Redirigiendo al Dashboard...");
                    router.push("/dashboard");
                }, 1000);

            } catch (error) {
                console.error("Error en demo:", error);
                setStatus("Error al cargar la demo. Revisa la consola.");
            }
        };

        initDemo();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-800">Preparando Entorno de Demo</h2>
                <p className="text-slate-600 mt-2">{status}</p>
            </div>
        </div>
    );
}
