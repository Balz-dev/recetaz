
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
     * Busca un diagnóstico por nombre exacto (case insensitive)
     */
    async findByExactName(nombre: string): Promise<DiagnosticoCatalogo | undefined> {
        return await db.diagnosticos
            .where('nombre')
            .equals(nombre)
            .first();
    },

    /**
     * Obtiene todos los diagnósticos paginados con ordenamiento opcional
     * 
     * @param offset - Desplazamiento para paginación
     * @param limit - Límite de resultados
     * @param ordenarPor - Criterio de ordenamiento ('nombre' | 'uso' | 'reciente')
     */
    async getAll(
        offset = 0,
        limit = 50,
        ordenarPor: 'nombre' | 'uso' | 'reciente' = 'uso'
    ): Promise<DiagnosticoCatalogo[]> {
        let query = db.diagnosticos.toCollection();

        // Aplicar ordenamiento
        if (ordenarPor === 'nombre') {
            query = db.diagnosticos.orderBy('nombre');
        } else if (ordenarPor === 'uso') {
            // Ordenar por vecesUsado descendente (más usados primero)
            const todos = await db.diagnosticos.toArray();
            return todos
                .sort((a, b) => (b.vecesUsado || 0) - (a.vecesUsado || 0))
                .slice(offset, offset + limit);
        }

        return await query
            .offset(offset)
            .limit(limit)
            .toArray();
    },

    /**
     * Obtiene estadísticas de diagnósticos
     */
    async getEstadisticas() {
        const todos = await db.diagnosticos.toArray();

        // Obtener especialidades únicas
        const especialidadesSet = new Set<string>();
        todos.forEach(diag => {
            diag.especialidad?.forEach(esp => especialidadesSet.add(esp));
        });

        return {
            total: todos.length,
            especialidades: Array.from(especialidadesSet).sort(),
            masUsados: todos
                .sort((a, b) => (b.vecesUsado || 0) - (a.vecesUsado || 0))
                .slice(0, 5)
        };
    },

    /**
     * Incrementa el contador de uso de un diagnóstico
     * 
     * @param id - ID del diagnóstico
     */
    async incrementarUso(id: number): Promise<void> {
        const diagnostico = await db.diagnosticos.get(id);
        if (diagnostico) {
            await db.diagnosticos.update(id, {
                vecesUsado: (diagnostico.vecesUsado || 0) + 1
            });
        }
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
            palabrasClave,
            vecesUsado: 0
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

