
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
            .equals(diagnosticoId)
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
                diagnosticoId,
                nombreTratamiento: medsSignature,
                medicamentos: medicamentos.map(m => ({
                    nombre: m.nombre,
                    nombreGenerico: m.nombreGenerico,
                    presentacion: m.presentacion,
                    dosis: m.dosis,
                    frecuencia: m.frecuencia,
                    duracion: m.duracion,
                    indicaciones: m.indicaciones
                })),
                instrucciones,
                especialidad,
                usoCount: 1,
                fechaUltimoUso: new Date()
            };
            await db.tratamientosHabituales.add(nuevoTratamiento);
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
    }
};
