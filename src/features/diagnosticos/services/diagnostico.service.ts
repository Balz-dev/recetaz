
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
     * Obtiene todos los diagnósticos paginados con ordenamiento y búsqueda opcional
     * 
     * @param offset - Desplazamiento para paginación
     * @param limit - Límite de resultados
     * @param ordenarPor - Criterio de ordenamiento ('nombre' | 'uso' | 'reciente')
     * @param busqueda - Término de búsqueda opcional
     * @returns Objeto con array de diagnósticos y total de registros
     */
    async getAll(
        offset = 0,
        limit = 50,
        ordenarPor: 'nombre' | 'uso' | 'reciente' = 'uso',
        busqueda: string = ""
    ): Promise<{ items: DiagnosticoCatalogo[]; total: number }> {
        let collection: import('dexie').Collection<DiagnosticoCatalogo, number>;

        if (busqueda && busqueda.trim().length > 0) {
            const queryNorm = busqueda.toLowerCase().trim();
            collection = db.diagnosticos.toCollection().filter(diag => {
                return !!(
                    diag.codigo.toLowerCase().includes(queryNorm) ||
                    diag.nombre.toLowerCase().includes(queryNorm) ||
                    diag.sinonimos?.some(s => s.toLowerCase().includes(queryNorm)) ||
                    diag.especialidad?.some(e => e.toLowerCase().includes(queryNorm))
                );
            });
        } else {
            collection = db.diagnosticos.toCollection();
        }

        // Obtener total antes de paginar
        const total = await collection.count();

        // Obtener items y ordenar en memoria
        let items = await collection.toArray();

        // Aplicar ordenamiento
        if (ordenarPor === 'nombre') {
            items.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (ordenarPor === 'uso') {
            items.sort((a, b) => (b.vecesUsado || 0) - (a.vecesUsado || 0));
        } else if (ordenarPor === 'reciente') {
            // No hay fecha explícita, usamos vecesUsado como proxy o simplemente el orden actual
            items.sort((a, b) => (b.vecesUsado || 0) - (a.vecesUsado || 0));
        }

        // Aplicar paginación
        const pagedItems = items.slice(offset, offset + limit);

        return { items: pagedItems, total };
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
     * Incrementa el contador de uso de un diagnóstico por su ID numérico.
     *
     * @param id - ID del diagnóstico en IndexedDB
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
     * Incrementa el contador de uso de un diagnóstico buscándolo por código CIE o nombre.
     * Si no existe en el catálogo, crea un nuevo registro personalizado.
     *
     * @param identificador - Código CIE-11 o nombre del diagnóstico
     * @param nombreCompleto - Nombre completo (usado si se crea uno nuevo)
     * @param especialidad - Especialidad del médico para el nuevo registro (opcional)
     */
    async incrementarUsoPorIdentificador(
        identificador: string,
        nombreCompleto?: string,
        especialidad?: string
    ): Promise<void> {
        // Intentar por código exacto primero
        let diagnostico = await db.diagnosticos
            .where('codigo')
            .equals(identificador)
            .first();

        // Si no se encontró por código, buscar por nombre
        if (!diagnostico) {
            diagnostico = await db.diagnosticos
                .where('nombre')
                .equals(nombreCompleto || identificador)
                .first();
        }

        if (diagnostico && diagnostico.id !== undefined) {
            // Existe → solo incrementar uso
            await db.diagnosticos.update(diagnostico.id, {
                vecesUsado: (diagnostico.vecesUsado || 0) + 1
            });
        } else {
            // No existe → crear con vecesUsado inicial = 1
            const timestamp = Date.now().toString().slice(-6);
            const codigoNuevo = identificador.length <= 10 ? identificador : `CUST-${timestamp}`;
            const nombre = nombreCompleto || identificador;
            const nombreNorm = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            await db.diagnosticos.add({
                codigo: codigoNuevo,
                nombre,
                sinonimos: [],
                especialidad: especialidad ? [especialidad] : [],
                vecesUsado: 1,
                palabrasClave: [codigoNuevo.toLowerCase(), ...nombreNorm.split(' ').filter(Boolean)]
            });
        }
    },

    /**
     * Crea un nuevo diagnóstico personalizado
     */
    async create(data: Omit<DiagnosticoCatalogo, 'id'>): Promise<number> {
        // Generar palabras clave automáticamente
        const nombreNorm = data.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const sinonimosNorm = (data.sinonimos || []).map(s => s.trim().toLowerCase());
        const medsNorm = (data.medicamentosSugeridos || []).map(m => m.nombre?.toLowerCase()).filter(Boolean) as string[];

        const palabrasClave = [
            data.codigo.toLowerCase(),
            ...nombreNorm.split(' '),
            ...sinonimosNorm,
            ...medsNorm
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
            const medsSugeridos = data.medicamentosSugeridos || (await db.diagnosticos.get(id))?.medicamentosSugeridos || [];
            const medsNorm = medsSugeridos.map(m => m.nombre?.toLowerCase()).filter(Boolean) as string[];

            palabrasClave = [
                (data.codigo || '').toLowerCase(),
                ...nombreNorm.split(' '),
                ...sinonimosNorm,
                ...medsNorm
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

