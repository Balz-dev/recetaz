
import { db } from "@/shared/db/db.config";
import { Medicamento, TratamientoHabitual } from "@/types";

/**
 * Servicio encargado de aprender de las recetas emitidas y sugerir tratamientos
 * basados en el diagnóstico y la especialidad del médico.
 */
export const treatmentLearningService = {
    /**
     * Registra o actualiza un tratamiento habitual basado en una nueva receta.
     * Si el médico recetó A y B para el diagnóstico X, reforzamos esa asociación.
     */
    async learn(diagnosticoId: string, medicamentos: Medicamento[], instrucciones: string, especialidad?: string) {
        if (!diagnosticoId || medicamentos.length === 0) return;

        // VERIFICACIÓN Y CREACIÓN AUTOMÁTICA DE DIAGNÓSTICO
        // Verificar si el diagnosticoId es un código existente o un texto libre
        let resolvedCode = diagnosticoId;

        // Intentar buscar por código exacto primero
        let diagEntry = await db.diagnosticos.where('codigo').equals(diagnosticoId).first();

        if (!diagEntry) {
            // Si no es código, buscar por nombre exacto
            diagEntry = await db.diagnosticos.where('nombre').equals(diagnosticoId).first();

            if (diagEntry) {
                resolvedCode = diagEntry.codigo;
            } else {
                // NO EXISTE: Crear nuevo diagnóstico personalizado en el catálogo
                const timestamp = Date.now().toString().slice(-6);
                resolvedCode = `CUST-${timestamp}`;

                // Generar keywords simples para el nuevo diagnóstico
                const keywords = [resolvedCode.toLowerCase(), ...diagnosticoId.toLowerCase().split(' ')];

                await db.diagnosticos.add({
                    codigo: resolvedCode,
                    nombre: diagnosticoId, // Usamos el input como nombre
                    especialidad: especialidad ? [especialidad] : ['General'],
                    palabrasClave: keywords,
                    sinonimos: []
                });

                console.log(`[Learning] Nuevo diagnóstico creado: ${diagnosticoId} (${resolvedCode})`);
            }
        }

        // Generar una firma del tratamiento (medicamentos) para ver si ya existe algo similar
        // Simplificación: usaremos el nombre del tratamiento como una cadena ordenada de IDs o nombres
        const medsSignature = medicamentos
            .map(m => m.nombreGenerico || m.nombre)
            .sort()
            .join(' + ');

        const nombreTratamiento = `Protocolo: ${medsSignature.substring(0, 50)}...`;

        // Buscar si ya existe este patrón para este diagnóstico y esta especialidad (o general)
        let existing = await db.tratamientosHabituales
            .where('diagnosticoId')
            .equals(resolvedCode)
            // .and(t => t.nombreTratamiento === nombreTratamiento) // Esto sería muy estricto, mejor buscar similitud
            .toArray();

        // Filtrar en memoria por similitud de contenido (por ahora exacto en firma simplificada)
        // En una v2 podríamos usar algoritmos de distancia
        const match = existing.find(t => {
            const tSignature = t.medicamentos
                .map(m => m.nombreGenerico || m.nombre)
                .sort()
                .join(' + ');
            return tSignature === medsSignature && t.especialidad === especialidad;
        });

        if (match) {
            // Reforzar aprendizaje (incrementar contador de uso)
            await db.tratamientosHabituales.update(match.id!, {
                usoCount: match.usoCount + 1,
                fechaUltimoUso: new Date(),
                instrucciones: instrucciones || match.instrucciones // Actualizar notas si las nuevas son más recientes
            });
        } else {
            // Aprender nuevo tratamiento
            const nuevoTratamiento: TratamientoHabitual = {
                diagnosticoId: resolvedCode,
                nombreTratamiento: medsSignature,
                medicamentos: medicamentos.map(m => ({
                    nombre: m.nombre,
                    nombreGenerico: m.nombreGenerico,
                    presentacion: m.presentacion,
                    formaFarmaceutica: m.formaFarmaceutica,
                    concentracion: m.concentracion,
                    dosis: m.dosis,
                    frecuencia: m.frecuencia,
                    duracion: m.duracion,
                    viaAdministracion: m.viaAdministracion,
                    cantidadSurtir: m.cantidadSurtir,
                    indicaciones: m.indicaciones
                })),
                instrucciones,
                especialidad,
                usoCount: 1,
                fechaUltimoUso: new Date()
            };
            await db.tratamientosHabituales.add(nuevoTratamiento);
            console.log(`[Learning] Nuevo tratamiento aprendido para ${resolvedCode}`);
        }
    },

    /**
     * Sugiere tratamientos para un diagnóstico dado.
     * Prioriza los de la especialidad del médico y los más usados.
     */
    async getSuggestions(diagnosticoId: string, especialidadMedico?: string): Promise<TratamientoHabitual[]> {
        let suggestions = await db.tratamientosHabituales
            .where('diagnosticoId')
            .equals(diagnosticoId)
            .toArray();

        // Ordenamiento inteligente
        suggestions.sort((a, b) => {
            // 1. Prioridad: Misma especialidad
            const aSameSpec = a.especialidad === especialidadMedico;
            const bSameSpec = b.especialidad === especialidadMedico;
            if (aSameSpec && !bSameSpec) return -1;
            if (!aSameSpec && bSameSpec) return 1;

            // 2. Prioridad: Más usados
            return b.usoCount - a.usoCount;
        });

        return suggestions.slice(0, 5); // Top 5 sugerencias
    },

    /**
     * Obtiene todos los tratamientos asociados a un diagnóstico (para gestión manual)
     */
    async getAllByDiagnostico(diagnosticoId: string): Promise<TratamientoHabitual[]> {
        return await db.tratamientosHabituales
            .where('diagnosticoId')
            .equals(diagnosticoId)
            .toArray();
    },

    /**
     * Guarda un tratamiento creado manualmente desde el catálogo.
     * Se le asigna un uso alto inicial para que aparezca como sugerencia prioritaria.
     */
    async saveManual(tratamiento: Omit<TratamientoHabitual, 'id' | 'usoCount' | 'fechaUltimoUso'>): Promise<number> {
        return await db.tratamientosHabituales.add({
            ...tratamiento,
            usoCount: 50, // Peso inicial alto para que sea la primera sugerencia
            fechaUltimoUso: new Date()
        });
    },

    /**
     * Elimina un tratamiento habitual
     */
    async delete(id: number): Promise<void> {
        await db.tratamientosHabituales.delete(id);
    }
};
