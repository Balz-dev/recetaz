import { db } from "@/shared/db/db.config";
import { MedicamentoCatalogo, MedicamentoCatalogoFormData } from "@/types";

export const medicamentoService = {
    /**
     * Obtiene todos los medicamentos ordenados alfabéticamente
     */
    getAll: async (): Promise<MedicamentoCatalogo[]> => {
        return await db.medicamentos
            .orderBy('nombre')
            .limit(100)
            .toArray();
    },

    /**
     * Busca medicamentos con priorización inteligente:
     * 1. Especialidad del médico (si coincide con la del medicamento)
     * 2. Popularidad (vecesUsado)
     * 3. Orden alfabético
     */
    searchWithPriority: async (query: string, especialidadMedico?: string): Promise<MedicamentoCatalogo[]> => {
        if (!query || query.length < 2) return [];

        const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const terms = normalizedQuery.split(' ').filter(Boolean);

        // Búsqueda usando índice palabrasClave de Dexie
        let resultados = await db.medicamentos
            .where('palabrasClave')
            .startsWithAnyOf(terms)
            .distinct()
            .limit(50) // Traemos un pool lo suficientemente grande para reordenar
            .toArray();

        // Filtrado exacto en memoria (AND logic)
        if (terms.length > 1) {
            resultados = resultados.filter(m => {
                const keywords = m.palabrasClave || [];
                const fullText = keywords.join(' ');
                return terms.every(t => fullText.includes(t));
            });
        }

        // Algoritmo de Priorización
        return resultados.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;

            // Factor 1: Especialidad (peso alto)
            if (especialidadMedico) {
                const aMatch = a.especialidad?.some(e => e.toLowerCase() === especialidadMedico.toLowerCase());
                const bMatch = b.especialidad?.some(e => e.toLowerCase() === especialidadMedico.toLowerCase());
                if (aMatch) scoreA += 1000;
                if (bMatch) scoreB += 1000;
            }

            // Factor 2: Personalizado (peso medio) - Preferimos lo que el médico ya personalizó
            if (a.esPersonalizado) scoreA += 500;
            if (b.esPersonalizado) scoreB += 500;

            // Factor 3: Popularidad (peso bajo pero diferencial)
            scoreA += (a.vecesUsado || 0);
            scoreB += (b.vecesUsado || 0);

            return scoreB - scoreA; // Descendente (mayor score primero)
        }).slice(0, 20); // Retornar top 20
    },

    /**
     * Busca medicamentos simple (legacy)
     */
    search: async (query: string): Promise<MedicamentoCatalogo[]> => {
        return await medicamentoService.searchWithPriority(query);
    },

    /**
     * Crea un nuevo medicamento
     */
    create: async (data: MedicamentoCatalogoFormData): Promise<number> => {
        const now = new Date();

        // Generar nombre de búsqueda y palabras clave
        const nombreBusqueda = data.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const palabrasClave = [
            ...nombreBusqueda.split(' '),
            ...(data.palabrasClave || []),
            data.nombreGenerico?.toLowerCase() || '',
            data.categoria?.toLowerCase() || ''
        ].filter(Boolean);

        const newMedicamento: Omit<MedicamentoCatalogo, 'id'> = {
            ...data,
            nombreBusqueda,
            palabrasClave,
            vecesUsado: 0,
            fechaCreacion: now,
        };

        const id = await db.medicamentos.add(newMedicamento as any);
        return id as number;
    },

    /**
     * Actualiza un medicamento existente
     */
    update: async (id: number, data: Partial<MedicamentoCatalogoFormData>): Promise<void> => {
        await db.medicamentos.update(id, {
            ...data,
            fechaUltimoUso: new Date() // Si se edita, se toca
        });
    },

    /**
     * Elimina un medicamento
     */
    delete: async (id: number): Promise<void> => {
        await db.medicamentos.delete(id);
    },

    /**
     * Busca o crea un medicamento por nombre.
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
            // nombreBusqueda se genera internamente en create
            esPersonalizado: true,
            sincronizado: false,
        });

        const created = await db.medicamentos.get(id);
        if (!created) throw new Error("Error al crear medicamento");
        return created;
    },

    /**
     * Incrementa el contador de uso de un medicamento
     */
    incrementUsage: async (id: number): Promise<void> => {
        const med = await db.medicamentos.get(id);
        if (med) {
            await db.medicamentos.update(id, {
                vecesUsado: (med.vecesUsado || 0) + 1,
                fechaUltimoUso: new Date()
            });
        }
    }
};

