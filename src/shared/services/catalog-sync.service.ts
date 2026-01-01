
import { db } from "@/shared/db/db.config";
import { MedicamentoCatalogo, DiagnosticoCatalogo } from "@/types";

/**
 * Servicio encargado de sincronizar los catálogos estáticos (JSON)
 * con la base de datos local (IndexedDB).
 */
export const catalogSyncService = {
    /**
     * Ejecuta la sincronización completa de catálogos.
     * Se recomienda llamar a este método al iniciar la aplicación.
     */
    async syncAll() {
        console.log('🔄 Iniciando sincronización de catálogos...');
        try {
            await Promise.all([
                this.syncMedicamentos(),
                this.syncDiagnosticos()
            ]);
            console.log('✅ Sincronización de catálogos completada.');
        } catch (error) {
            console.error('❌ Error general en sincronización de catálogos:', error);
        }
    },

    /**
     * Sincroniza el catálogo de medicamentos desde /data/medicamentos-v1.json
     */
    async syncMedicamentos() {
        try {
            const response = await fetch('/data/medicamentos-v1.json');
            if (!response.ok) throw new Error('No se pudo cargar el JSON de medicamentos');

            const medicamentosExternos: any[] = await response.json();

            await db.transaction('rw', db.medicamentos, async () => {
                for (const med of medicamentosExternos) {
                    // Normalización para búsqueda
                    const nombreBusqueda = med.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const palabrasClave = [
                        ...nombreBusqueda.split(' '),
                        med.nombreGenerico?.toLowerCase() || '',
                        med.formaFarmaceutica?.toLowerCase() || ''
                    ].filter(Boolean);

                    // Verificar si ya existe por ID (si el JSON trae IDs estables) o por nombre
                    // Asumimos que los del JSON no son personalizados (esPersonalizado: false)
                    const existing = await db.medicamentos.where('nombreBusqueda').equals(nombreBusqueda).first();

                    if (existing) {
                        // Si existe y NO es personalizado, actualizamos datos del catálogo oficial
                        // Si es personalizado, respetamos la versión del usuario (o podríamos fusionar)
                        if (!existing.esPersonalizado) {
                            await db.medicamentos.update(existing.id!, {
                                ...med,
                                nombreBusqueda,
                                palabrasClave,
                                updatedAt: new Date()
                            });
                        }
                    } else {
                        // Insertar nuevo registro del catálogo oficial
                        const nuevoMedicamento: MedicamentoCatalogo = {
                            ...med,
                            nombreBusqueda,
                            palabrasClave,
                            esPersonalizado: false,
                            vecesUsado: 0,
                            fechaCreacion: new Date()
                        };
                        await db.medicamentos.add(nuevoMedicamento);
                    }
                }
            });
            console.log(`📦 Medicamentos sincronizados: ${medicamentosExternos.length} items procesados.`);

        } catch (error) {
            console.error('Error sincronizando medicamentos:', error);
        }
    },

    /**
     * Sincroniza el catálogo de diagnósticos desde /data/diagnosticos-v1.json
     */
    async syncDiagnosticos() {
        try {
            const response = await fetch('/data/diagnosticos-v1.json');
            if (!response.ok) throw new Error('No se pudo cargar el JSON de diagnósticos');

            const diagnosticosExternos: any[] = await response.json();

            await db.transaction('rw', db.diagnosticos, async () => {
                for (const diag of diagnosticosExternos) {
                    // Normalización
                    const textoNormalizado = diag.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const sinonimosNorm = (diag.sinonimos || []).map((s: string) => s.toLowerCase());

                    const palabrasClave = [
                        diag.codigo.toLowerCase(),
                        ...textoNormalizado.split(' '),
                        ...sinonimosNorm
                    ].filter(Boolean);

                    // Buscar existencia por Código CIE
                    const existing = await db.diagnosticos.where('codigo').equals(diag.codigo).first();

                    if (existing) {
                        // Actualizar
                        await db.diagnosticos.update(existing.id!, {
                            ...diag,
                            palabrasClave
                        });
                    } else {
                        // Insertar
                        const nuevoDiagnostico: DiagnosticoCatalogo = {
                            ...diag,
                            palabrasClave
                        };
                        await db.diagnosticos.add(nuevoDiagnostico);
                    }
                }
            });
            console.log(`📋 Diagnósticos sincronizados: ${diagnosticosExternos.length} items procesados.`);

        } catch (error) {
            console.error('Error sincronizando diagnósticos:', error);
        }
    }
};
