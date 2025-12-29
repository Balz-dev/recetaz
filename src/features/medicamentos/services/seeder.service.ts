
import { db } from "@/shared/db/db.config";
import { commonMedications } from "@/shared/utils/seeds/medicamentos-data";
import { v4 as uuidv4 } from 'uuid';

export const seederService = {
    /**
     * Pobla la base de datos con un catálogo extenso de medicamentos.
     * @returns Número de medicamentos insertados
     */
    seedMedicamentos: async (): Promise<number> => {
        try {
            console.log('🌱 Iniciando seed de medicamentos desde el cliente...');

            // Verificar si ya hay medicamentos para evitar duplicados masivos
            const count = await db.medicamentos.count();
            if (count > 0) {
                console.log(`ℹ️ Ya existen ${count} medicamentos. Verificando duplicados...`);
            }

            const now = new Date();
            let insertados = 0;

            // Usamos una transacción para eficiencia y consistencia
            await db.transaction('rw', db.medicamentos, async () => {
                for (const med of commonMedications) {
                    // Construir nombre y presentación basados en la nueva estructura
                    const nombreDisplay = med.nombreComercial
                        ? `${med.nombreComercial} (${med.nombreGenerico})`
                        : med.nombreGenerico;

                    const presentacionDisplay = `${med.formaFarmaceutica} ${med.concentracion}`;

                    // Verificar si ya existe este medicamento con la misma presentación
                    const existing = await db.medicamentos
                        .where('nombre')
                        .equals(nombreDisplay)
                        .and(m => m.presentacion === presentacionDisplay)
                        .first();

                    if (!existing) {
                        await db.medicamentos.add({
                            id: uuidv4(),
                            nombre: nombreDisplay,
                            nombreGenerico: med.nombreGenerico,
                            presentacion: presentacionDisplay,
                            formaFarmaceutica: med.formaFarmaceutica,
                            concentracion: med.concentracion,
                            cantidadSurtir: med.cantidadSurtir,
                            dosis: med.dosis,
                            viaAdministracion: med.viaAdministracion,
                            frecuencia: med.frecuencia,
                            duracion: med.duracion,
                            indicaciones: med.indicaciones,
                            createdAt: now,
                            updatedAt: now
                        });
                        insertados++;
                    }
                }
            });

            console.log(`✅ Seed completado. Se agregaron ${insertados} nuevos medicamentos.`);
            return insertados;
        } catch (error) {
            console.error('❌ Error al poblar medicamentos:', error);
            throw error;
        }
    }
};
