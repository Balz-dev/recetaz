
import { db } from '@/shared/db/db.config';
import { PlantillaReceta, PlantillaRecetaFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const plantillaService = {
    /**
     * Obtiene todas las plantillas registradas
     */
    getAll: async () => {
        return await db.plantillas.toArray();
    },

    /**
     * Obtiene una plantilla por su ID
     */
    getById: async (id: string) => {
        return await db.plantillas.get(id);
    },

    /**
     * Obtiene la plantilla activa (si existe)
     */
    getActive: async () => {
        // En Dexie los booleanos se pueden consultar directamente si están indexados
        // Sin embargo, filter es más seguro si el índice no funcionara como se espera en todos los navegadores
        const activas = await db.plantillas.filter(p => p.activa === true).toArray();
        return activas.length > 0 ? activas[0] : null;
    },

    /**
     * Crea una nueva plantilla
     */
    create: async (data: PlantillaRecetaFormData) => {
        return db.transaction('rw', db.plantillas, async () => {
            // Si la nueva plantilla es activa, desactivar las demás
            if (data.activa) {
                await db.plantillas
                    .filter(p => p.activa === true)
                    .modify({ activa: false });
            }

            const nuevaPlantilla: PlantillaReceta = {
                ...data,
                id: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.plantillas.add(nuevaPlantilla);
            return nuevaPlantilla.id;
        });
    },

    /**
     * Actualiza una plantilla existente
     */
    update: async (id: string, data: Partial<PlantillaRecetaFormData>) => {
        return db.transaction('rw', db.plantillas, async () => {
            // Si se está activando esta plantilla, desactivar las demás
            if (data.activa === true) {
                await db.plantillas
                    .where('id').notEqual(id)
                    .filter(p => p.activa === true)
                    .modify({ activa: false });
            }

            await db.plantillas.update(id, {
                ...data,
                updatedAt: new Date()
            });
        });
    },

    /**
     * Elimina una plantilla
     */
    delete: async (id: string) => {
        await db.plantillas.delete(id);
    }
};
