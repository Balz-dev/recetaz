import { db } from "@/shared/db/db.config";
import { catalogoMedicamentosInicial } from "@/shared/utils/seeds/medicamentos-data";
import { normalizarTexto } from "@/shared/services/medicamentos.service";

/**
 * Servicio de seeding antiguo
 * @deprecated Usar el script scripts/seed-medicamentos.ts en su lugar
 */
export const seederService = {
    /**
     * Pobla la base de datos con un catálogo extenso de medicamentos.
     * @returns Número de medicamentos insertados
     * @deprecated Usar npm run seed:medicamentos en su lugar
     */
    seedMedicamentos: async (): Promise<number> => {
        try {
            console.log('🌱 Iniciando seed de medicamentos desde el cliente...');

            // Verificar si ya hay medicamentos para evitar duplicados masivos
            const count = await db.medicamentos.count();
            if (count > 0) {
                console.log(`ℹ️ Ya existen ${count} medicamentos. Saltando seed.`);
                return 0;
            }

            const now = new Date();
            let insertados = 0;

            // Preparar medicamentos con campos calculados
            const medicamentosParaInsertar = catalogoMedicamentosInicial.map(med => ({
                ...med,
                nombreBusqueda: normalizarTexto(med.nombre),
                vecesUsado: 0,
                fechaCreacion: now,
            }));

            // Insertar en lote (más eficiente)
            await db.medicamentos.bulkAdd(medicamentosParaInsertar as any);
            insertados = medicamentosParaInsertar.length;

            console.log(`✅ Seed completado. Se agregaron ${insertados} nuevos medicamentos.`);
            return insertados;
        } catch (error) {
            console.error('❌ Error al poblar medicamentos:', error);
            throw error;
        }
    }
};
