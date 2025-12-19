
import { db } from "@/shared/db/db.config";
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const medicamentoService = {
    /**
     * Obtiene todos los medicamentos del catálogo ordenados alfabéticamente.
     * 
     * @returns Una promesa que se resuelve con un array de medicamentos del catálogo.
     */
    getAll: async (): Promise<MedicamentoCatalogo[]> => {
        return await db.medicamentos
            .orderBy('nombre')
            .toArray();
    },

    /**
     * Busca medicamentos en el catálogo local usando un sistema de tokens inteligente.
     * Soporta búsqueda por nombre genérico y comercial.
     * 
     * @param query - El término de búsqueda ingresado por el usuario.
     * @returns Una promesa con los resultados que coinciden con los tokens de búsqueda.
     */
    search: async (query: string): Promise<MedicamentoCatalogo[]> => {
        if (!query) return [];
        
        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return [];

        // 1. Buscar coincidencia con la primera palabra usando el índice
        let results = await db.medicamentos
            .where('busquedaTokens')
            .startsWithIgnoreCase(words[0])
            .distinct()
            .limit(50)
            .toArray();

        // 2. Filtrar en memoria si hay más palabras (AND lógico)
        if (words.length > 1) {
            const remainingWords = words.slice(1);
            results = results.filter(med => 
                remainingWords.every(word => 
                    med.busquedaTokens.some(token => token.toLowerCase().startsWith(word))
                )
            );
        }

        return results;
    },

    /**
     * Crea un nuevo registro de medicamento en el catálogo.
     * Genera automáticamente los tokens de búsqueda.
     * 
     * @param data - Los datos del medicamento a crear.
     * @returns Una promesa con el ID del medicamento creado.
     */
    create: async (data: MedicamentoCatalogoFormData): Promise<string> => {
        const id = uuidv4();
        const now = new Date();

        // Generar tokens de búsqueda
        const tokens = new Set<string>();
        data.nombre.toLowerCase().split(/\s+/).forEach(t => tokens.add(t));
        if (data.nombreComercial) {
            data.nombreComercial.toLowerCase().split(/\s+/).forEach(t => tokens.add(t));
        }

        const newMedicamento: MedicamentoCatalogo = {
            id,
            ...data,
            busquedaTokens: Array.from(tokens).filter(t => t.length > 0),
            createdAt: now,
            updatedAt: now
        };

        await db.medicamentos.add(newMedicamento);
        return id;
    },

    /**
     * Actualiza un medicamento existente y regenera sus tokens de búsqueda si es necesario.
     * 
     * @param id - ID del medicamento a actualizar.
     * @param data - Datos parciales para actualizar.
     */
    update: async (id: string, data: Partial<MedicamentoCatalogoFormData>): Promise<void> => {
        const updates: any = {
            ...data,
            updatedAt: new Date()
        };

        // Regenerar tokens si cambia el nombre
        if (data.nombre || data.nombreComercial) {
            const current = await db.medicamentos.get(id);
            if (current) {
                const nombre = data.nombre || current.nombre;
                const nombreComercial = data.nombreComercial !== undefined ? data.nombreComercial : current.nombreComercial;
                
                const tokens = new Set<string>();
                nombre.toLowerCase().split(/\s+/).forEach(t => tokens.add(t));
                if (nombreComercial) {
                    nombreComercial.toLowerCase().split(/\s+/).forEach(t => tokens.add(t));
                }
                updates.busquedaTokens = Array.from(tokens).filter(t => t.length > 0);
            }
        }

        await db.medicamentos.update(id, updates);
    },

    /**
     * Elimina un medicamento del catálogo.
     * 
     * @param id - ID del medicamento a eliminar.
     */
    delete: async (id: string): Promise<void> => {
        await db.medicamentos.delete(id);
    },

    /**
     * Busca un medicamento por su nombre exacto o lo crea si no existe.
     * Útil para añadir medicamentos sobre la marcha durante la creación de una receta.
     * 
     * @param nombre - Nombre del medicamento a buscar o crear.
     * @returns Una promesa con el objeto del medicamento (existente o recién creado).
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
            presentacion: '',
        } as any);

        const created = await db.medicamentos.get(id);
        if (!created) throw new Error("Error al crear medicamento");
        return created;
    }
};
