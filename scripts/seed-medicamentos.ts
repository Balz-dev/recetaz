
import 'fake-indexeddb/auto';
import { db } from '../src/shared/db/db.config';
import { commonMedications } from '../src/shared/utils/seeds/medicamentos-data';
import { v4 as uuidv4 } from 'uuid';

async function seedMedicamentos() {
    console.log('🌱 Iniciando seed de medicamentos...');

    // Verificar si ya hay medicamentos para no duplicar masivamente
    const count = await db.medicamentos.count();
    if (count > 0) {
        console.log(`ℹ️ Ya existen ${count} medicamentos en la base de datos.`);
        if (count > 10) {
            console.log('✅ Saltando seed de medicamentos para preservar datos existentes.');
            return;
        }
    }

    const now = new Date();
    // Usamos una transacción para eficiencia
    await db.transaction('rw', db.medicamentos, async () => {
        for (const med of commonMedications) {
            // Construir el nombre completo del medicamento
            const nombreCompleto = med.nombreComercial
                ? `${med.nombreGenerico} (${med.nombreComercial})`
                : med.nombreGenerico;

            const presentacion = `${med.concentracion} - ${med.formaFarmaceutica}`;

            // Verificar si ya existe
            const existing = await db.medicamentos
                .where('nombre')
                .equals(nombreCompleto)
                .and(m => m.presentacion === presentacion)
                .first();

            if (!existing) {
                await db.medicamentos.add({
                    id: uuidv4(),
                    nombre: nombreCompleto,
                    presentacion: presentacion,
                    createdAt: now,
                    updatedAt: now
                });
            }
        }
    });

    console.log(`✅ Seed de medicamentos completado exitosamente.`);
}

// Ejecutar si se llama directamente
seedMedicamentos().catch(console.error);

export { seedMedicamentos };

