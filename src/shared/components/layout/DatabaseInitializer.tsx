"use client";

import { useEffect } from "react";
import { inicializarMedicamentosSiVacio } from "@/shared/utils/seed";

export function DatabaseInitializer() {
    useEffect(() => {
        // Ejecutar inicialización de forma asíncrona sin bloquear la UI
        inicializarMedicamentosSiVacio().catch(err => {
            console.error("Error en inicialización automática de base de datos:", err);
        });
    }, []);

    return null; // Este componente no renderiza nada visual
}
