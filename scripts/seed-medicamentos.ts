/**
 * @fileoverview Script para inicializar el catálogo de medicamentos
 * 
 * Este script carga el catálogo inicial de medicamentos comunes
 * Solo se ejecuta si la tabla está vacía
 * 
 * Uso: npm run seed:medicamentos
 */

import 'fake-indexeddb/auto';
import { db } from '../src/shared/db/db.config';
import { catalogoMedicamentosInicial } from '../src/shared/utils/seeds/medicamentos-data';
import { normalizarTexto } from '../src/shared/services/medicamentos.service';
import { MedicamentoCatalogo } from '../src/types';

/**
 * Carga el catálogo inicial de medicamentos en la base de datos
 */
async function seedMedicamentos() {
    try {
        console.log('🏥 Iniciando seed de medicamentos...\n');

        // Verificar si ya existen medicamentos
        const count = await db.medicamentos.count();

        if (count > 0) {
            console.log(`⚠️  Ya existen ${count} medicamentos en la base de datos.`);
            console.log('💡 Para recargar el catálogo, elimina la base de datos primero.\n');
            return;
        }

        console.log('📦 Preparando catálogo de medicamentos...');
        console.log(`   Total de medicamentos a cargar: ${catalogoMedicamentosInicial.length}\n`);

        // Preparar medicamentos con campos calculados
        const medicamentosParaInsertar: Omit<MedicamentoCatalogo, 'id'>[] = catalogoMedicamentosInicial.map(med => ({
            ...med,
            nombreBusqueda: normalizarTexto(med.nombre),
            vecesUsado: 0,
            fechaCreacion: new Date(),
        }));

        // Insertar en lote (más eficiente)
        await db.medicamentos.bulkAdd(medicamentosParaInsertar as any);

        console.log('✅ Catálogo de medicamentos cargado exitosamente!\n');

        // Mostrar estadísticas por categoría
        const categorias = new Map<string, number>();
        medicamentosParaInsertar.forEach(med => {
            const cat = med.categoria || 'Sin categoría';
            categorias.set(cat, (categorias.get(cat) || 0) + 1);
        });

        console.log('📊 Resumen por categoría:');
        Array.from(categorias.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([categoria, cantidad]) => {
                console.log(`   ${categoria}: ${cantidad} medicamentos`);
            });

        console.log('\n✨ ¡Proceso completado con éxito!\n');

    } catch (error) {
        console.error('❌ Error al cargar medicamentos:', error);
        process.exit(1);
    } finally {
        // Cerrar conexión
        db.close();
    }
}

// Ejecutar seed
seedMedicamentos();
