
import { db } from "@/shared/db/db.config";
import { DiagnosticoCatalogo } from "@/types";

export const diagnosticoService = {
    /**
     * Busca diagnósticos por texto y opcionalmente filtra/prioriza por especialidad.
     * Utiliza índices 'palabrasClave' y 'nombre' de Dexie.
     */
    async search(query: string, especialidadPrioritaria?: string): Promise<DiagnosticoCatalogo[]> {
        if (!query || query.length < 2) return [];

        const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const terms = normalizedQuery.split(' ').filter(Boolean);

        // Estrategia de búsqueda:
        // 1. Coincidencia exacta de código (muy rápido)
        // 2. Coincidencia en palabras clave (full text search simulado)

        let resultados = await db.diagnosticos
            .where('palabrasClave')
            .startsWithAnyOf(terms)
            .distinct()
            .limit(50)
            .toArray();

        // Filtrado en memoria para asegurar que TODOS los términos coinciden (AND logic)
        // Dexie anyOf es OR logic por defecto
        if (terms.length > 1) {
            resultados = resultados.filter(d => {
                const keywords = d.palabrasClave || [];
                // Unir todas las keywords del diagnostico en un string largo para buscar
                const diagnosticText = keywords.join(' ');
                return terms.every(t => diagnosticText.includes(t));
            });
        }

        // Priorización por especialidad en memoria
        if (especialidadPrioritaria) {
            resultados.sort((a, b) => {
                const aMatch = a.especialidad?.some(e => e.toLowerCase() === especialidadPrioritaria.toLowerCase());
                const bMatch = b.especialidad?.some(e => e.toLowerCase() === especialidadPrioritaria.toLowerCase());
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
            });
        }

        return resultados.slice(0, 20); // Retornar top 20
    },

    /**
     * Obtiene todos los diagnósticos paginados
     */
    async getAll(offset = 0, limit = 50): Promise<DiagnosticoCatalogo[]> {
        return await db.diagnosticos
            .offset(offset)
            .limit(limit)
            .toArray();
    },

    /**
     * Crea un nuevo diagnóstico personalizado
     */
    async create(data: Omit<DiagnosticoCatalogo, 'id'>): Promise<number> {
        // Generar palabras clave automáticamente
        const nombreNorm = data.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const sinonimosNorm = (data.sinonimos || []).map(s => s.toLowerCase());
        const palabrasClave = [
            data.codigo.toLowerCase(),
            ...nombreNorm.split(' '),
            ...sinonimosNorm
        ].filter(Boolean);

        return await db.diagnosticos.add({
            ...data,
            palabrasClave
        });
    },

    /**
     * Actualiza un diagnóstico existente
     */
    async update(id: number, data: Partial<DiagnosticoCatalogo>): Promise<void> {
        // Si cambia nombre o sinónimos, regenerar keywords... 
        // Por simplicidad, recalcular siempre si vienen datos de texto
        let palabrasClave = data.palabrasClave;
        if (data.nombre || data.sinonimos) {
            const nombre = data.nombre || (await db.diagnosticos.get(id))?.nombre || '';
            const sinonimos = data.sinonimos || (await db.diagnosticos.get(id))?.sinonimos || [];

            const nombreNorm = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const sinonimosNorm = sinonimos.map(s => s.toLowerCase());

            palabrasClave = [
                (data.codigo || '').toLowerCase(),
                ...nombreNorm.split(' '),
                ...sinonimosNorm
            ].filter(Boolean);
        }

        await db.diagnosticos.update(id, {
            ...data,
            ...(palabrasClave && { palabrasClave })
        });
    },

    /**
     * Elimina un diagnóstico
     */
    async delete(id: number): Promise<void> {
        await db.diagnosticos.delete(id);
    }
};
