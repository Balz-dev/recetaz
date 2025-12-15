
import { db } from "@/shared/db/db.config";
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const medicamentoService = {
    /**
     * Obtiene todos los medicamentos ordenados alfabéticamente
     */
    getAll: async (): Promise<MedicamentoCatalogo[]> => {
        return await db.medicamentos
            .orderBy('nombre')
            .toArray();
    },

    /**
     * Busca medicamentos que coincidan con el término de búsqueda
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
     */
    create: async (data: MedicamentoCatalogoFormData): Promise<string> => {
        const id = uuidv4();
        const now = new Date();

        const newMedicamento: MedicamentoCatalogo = {
            id,
            ...data,
            createdAt: now,
            updatedAt: now
        };

        await db.medicamentos.add(newMedicamento);
        return id;
    },

    /**
     * Actualiza un medicamento existente
     */
    update: async (id: string, data: Partial<MedicamentoCatalogoFormData>): Promise<void> => {
        await db.medicamentos.update(id, {
            ...data,
            updatedAt: new Date()
        });
    },

    /**
     * Elimina un medicamento
     */
    delete: async (id: string): Promise<void> => {
        await db.medicamentos.delete(id);
    },

    /**
     * Busca o crea un medicamento por nombre.
     * Útil para cuando se agrega desde la receta.
     */
    findOrCreateByName: async (nombre: string): Promise<MedicamentoCatalogo> => {
        const existing = await db.medicamentos
            .where('nombre')
            .equalsIgnoreCase(nombre)
            .first();

        if (existing) {
            return existing;
        }

        const id = await medicamentoService.create({
            nombre: nombre,
            presentacion: '' // Por defecto sin presentación si se crea al vuelo
        });

        const created = await db.medicamentos.get(id);
        if (!created) throw new Error("Error al crear medicamento");
        return created;
    }
};
