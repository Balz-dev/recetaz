"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TODO: Import from @packages/fixtures when monorepo is ready
const fixtures = {
    medicamentos: [
        { id: "1", nombre: "Paracetamol", dosis: "500 mg" },
        { id: "2", nombre: "Ibuprofeno", dosis: "400 mg" }
    ],
    pacientes: [
        { id: "1", nombre: "Juan Pérez", edad: 30 },
        { id: "2", nombre: "María García", edad: 25 }
    ]
};

export default function DemoPage() {
    const router = useRouter();
    const [status, setStatus] = useState("Inicializando demo...");

    useEffect(() => {
        const initDemo = async () => {
            try {
                // Aquí iría la lógica de seed real usando Dexie
                console.log("Seeding database with:", fixtures);

                // Simular delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                setStatus("Datos cargados. Redirigiendo...");
                router.push("/dashboard");
            } catch (error) {
                console.error("Error en demo:", error);
                setStatus("Error al cargar la demo.");
            }
        };

        initDemo();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600 font-medium">{status}</p>
        </div>
    );
}
