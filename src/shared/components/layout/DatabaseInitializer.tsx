"use client";

import { useEffect } from "react";
// import { inicializarMedicamentosSiVacio } from "@/shared/utils/seed"; // Deprecado por sistema JSON
import { catalogSyncService } from "@/shared/services/catalog-sync.service";

export function DatabaseInitializer() {
    useEffect(() => {
        // Ejecutar sincronización de catálogos (Medicamentos y Diagnósticos)
        // Esto verifica los JSON estáticos y actualiza IndexedDB sin borrar personalizaciones
        catalogSyncService.syncAll();

        /* 
        Legacy:
        inicializarMedicamentosSiVacio().catch(err => {
            console.error("Error en inicialización automática de base de datos:", err);
        });
        */
    }, []);

    return null;
}
