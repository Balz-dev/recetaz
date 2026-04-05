"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { plantillaService } from "../services/plantilla.service";
import { PlantillaReceta, PlantillaRecetaFormData } from "@/types";

/**
 * Hook para gestionar las plantillas de recetas de forma reactiva.
 * Encapsula completamente el acceso a IndexedDB y al servicio de plantillas,
 * evitando que la capa de presentación dependa de la infraestructura.
 *
 * @returns Listado reactivo de plantillas, estado de carga y acciones disponibles.
 */
export function usePlantillas() {
    const plantillas = useLiveQuery<PlantillaReceta[]>(
        () => plantillaService.getAll(),
        []
    );
    const isLoading = plantillas === undefined;

    /**
     * Obtiene la plantilla activa actual.
     * @returns La plantilla activa o null si no existe.
     */
    const obtenerActiva = useCallback(async () => {
        return await plantillaService.getActive();
    }, []);

    /**
     * Crea una nueva plantilla y la registra como activa si así se indica.
     *
     * @param data - Datos del formulario de la plantilla.
     * @returns ID de la nueva plantilla creada.
     */
    const crear = useCallback(async (data: PlantillaRecetaFormData) => {
        return await plantillaService.create(data);
    }, []);

    /**
     * Actualiza los campos de una plantilla existente.
     *
     * @param id - Identificador de la plantilla.
     * @param data - Campos a actualizar.
     */
    const actualizar = useCallback(
        async (id: string, data: Partial<PlantillaRecetaFormData>) => {
            await plantillaService.update(id, data);
        },
        []
    );

    /**
     * Elimina una plantilla por su ID.
     *
     * @param id - Identificador de la plantilla a eliminar.
     */
    const eliminar = useCallback(async (id: string) => {
        await plantillaService.delete(id);
    }, []);

    return {
        plantillas: plantillas ?? [],
        isLoading,
        obtenerActiva,
        crear,
        actualizar,
        eliminar,
    };
}
