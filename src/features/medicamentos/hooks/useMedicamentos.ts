"use client";

import { useCallback, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
    obtenerEstadisticasMedicamentos,
    obtenerMedicamentos,
    eliminarMedicamento,
    agregarMedicamento,
    actualizarMedicamento,
} from "@/shared/services/medicamentos.service";
import { MedicamentoCatalogo } from "@/types";

/**
 * Filtros disponibles para la búsqueda de medicamentos.
 */
interface FiltrosMedicamentos {
    categoria?: string;
    soloPersonalizados?: boolean;
    ordenarPor?: "nombre" | "uso" | "reciente";
    busqueda?: string;
}

/**
 * Hook para gestionar las estadísticas del catálogo de medicamentos.
 * Encapsula el acceso reactivo a IndexedDB y abstrae la capa de infraestructura.
 *
 * @returns Estadísticas del catálogo y estado de carga.
 */
export function useMedicamentosEstadisticas() {
    const data = useLiveQuery(() => obtenerEstadisticasMedicamentos(), []);
    const isLoading = data === undefined;

    return {
        data,
        isLoading,
    };
}

/**
 * Hook principal para gestionar el catálogo de medicamentos (CRUD + paginación).
 * Abstrae completamente la capa de presentación del acceso a IndexedDB y los servicios.
 *
 * @returns Estado de medicamentos y acciones disponibles.
 */
export function useMedicamentos() {
    const [medicamentos, setMedicamentos] = useState<MedicamentoCatalogo[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Carga medicamentos aplicando filtros y paginación.
     *
     * @param filtros - Criterios de filtrado opcionales.
     * @param paginacion - Configuración de offset y limit.
     */
    const cargar = useCallback(
        async (
            filtros?: FiltrosMedicamentos,
            paginacion?: { offset: number; limit: number }
        ) => {
            setIsLoading(true);
            try {
                const resultado = await obtenerMedicamentos(filtros, paginacion);
                setMedicamentos(resultado.items);
                setTotalItems(resultado.total);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * Elimina un medicamento por su ID.
     *
     * @param id - ID del medicamento a eliminar.
     */
    const eliminar = useCallback(async (id: number) => {
        await eliminarMedicamento(id);
    }, []);

    /**
     * Agrega un nuevo medicamento al catálogo.
     *
     * @param medicamento - Datos del medicamento a agregar.
     * @returns ID del medicamento creado o encontrado.
     */
    const agregar = useCallback(
        async (
            medicamento: Omit<
                MedicamentoCatalogo,
                "id" | "nombreBusqueda" | "fechaCreacion" | "vecesUsado"
            >
        ) => {
            return await agregarMedicamento(medicamento);
        },
        []
    );

    /**
     * Actualiza los datos de un medicamento existente.
     *
     * @param id - ID del medicamento a actualizar.
     * @param cambios - Campos a modificar.
     */
    const actualizar = useCallback(
        async (id: number, cambios: Partial<Omit<MedicamentoCatalogo, "id" | "fechaCreacion">>) => {
            await actualizarMedicamento(id, cambios);
        },
        []
    );

    return {
        medicamentos,
        totalItems,
        isLoading,
        cargar,
        eliminar,
        agregar,
        actualizar,
    };
}
