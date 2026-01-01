import { db } from "@/shared/db/db.config";
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from "@/types";

/**
 * Servicio antiguo de medicamentos
 * @deprecated Usar funciones de @/shared/services/medicamentos.service en su lugar
 */
export const medicamentoService = {
    /**
     * Obtiene todos los medicamentos ordenados alfabéticamente
     * @deprecated Usar obtenerMedicamentos de @/shared/services/medicamentos.service
     */
    getAll: async (): Promise<MedicamentoCatalogo[]> => {
        return await db.medicamentos
            .orderBy('nombre')
            .toArray();
    },

    /**
     * Busca medicamentos que coincidan con el término de búsqueda
     * @deprecated Usar buscarMedicamentosAutocompletado de @/shared/services/medicamentos.service
     */
    search: async (query: string): Promise<MedicamentoCatalogo[]> => {
        if (!query) return [];

        const lowerQuery = query.toLowerCase();

        return await db.medicamentos
            .filter(m => m.nombre.toLowerCase().includes(lowerQuery))
            .limit(20)
            .toArray();
    },

    /**
     * Crea un nuevo medicamento
     * @deprecated Usar agregarMedicamento de @/shared/services/medicamentos.service
     */
    create: async (data: MedicamentoCatalogoFormData): Promise<number> => {
        const now = new Date();

        const newMedicamento: Omit<MedicamentoCatalogo, 'id'> = {
            ...data,
            nombreBusqueda: data.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            vecesUsado: 0,
            fechaCreacion: now,
        };

        const id = await db.medicamentos.add(newMedicamento as any);
        return id as number;
    },

    /**
     * Actualiza un medicamento existente
     * @deprecated Usar actualizarMedicamento de @/shared/services/medicamentos.service
     */
    update: async (id: number, data: Partial<MedicamentoCatalogoFormData>): Promise<void> => {
        await db.medicamentos.update(id, data);
    },

    /**
     * Elimina un medicamento
     * @deprecated Usar eliminarMedicamento de @/shared/services/medicamentos.service
     */
    delete: async (id: number): Promise<void> => {
        await db.medicamentos.delete(id);
    },

    /**
     * Busca o crea un medicamento por nombre.
     * Útil para cuando se agrega desde la receta.
     * @deprecated Usar agregarMedicamento de @/shared/services/medicamentos.service
     */
    findOrCreateByName: async (nombre: string): Promise<MedicamentoCatalogo> => {
        const nombreNormalizado = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const existing = await db.medicamentos
            .where('nombreBusqueda')
            .equals(nombreNormalizado)
            .first();

        if (existing) {
            return existing;
        }

        const id = await medicamentoService.create({
            nombre: nombre,
            esPersonalizado: true,
            sincronizado: false,
        });

        const created = await db.medicamentos.get(id);
        if (!created) throw new Error("Error al crear medicamento");
        return created;
    }
};
