import { db } from "@/shared/db/db.config";
import { MedicamentoCatalogo, DiagnosticoCatalogo, TratamientoHabitual, EspecialidadCatalogo } from "@/types";
import { generarConfiguracionFinanciera } from "@/shared/utils/seed";

const MEDICAMENTOS_URL = '/data/medicamentos-v1.json';
const DIAGNOSTICOS_URL = '/data/diagnosticos-v1.json';
const TRATAMIENTOS_URL = '/data/tratamientos-iniciales.json';
const ESPECIALIDADES_URL = '/data/especialidades-v1.json';

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
                this.syncDiagnosticos(),
                this.syncTratamientos(),
                this.syncEspecialidades(),
                this.syncConfigFinanciera()
            ]);
            console.log('✅ Sincronización de catálogos completada.');
        } catch (error) {
            console.error('❌ Error general en sincronización de catálogos:', error);
        }
    },



    /**
     * Sincroniza la configuración financiera base si no existe.
     */
    async syncConfigFinanciera() {
        try {
            const count = await db.configuracionFinanciera.count();
            if (count === 0) {
                console.log('⚙️ Cargando configuración financiera base...');
                const config = generarConfiguracionFinanciera();
                await db.configuracionFinanciera.add(config);
                console.log('✅ Configuración financiera base cargada.');
            }
        } catch (error) {
            console.error('Error sincronizando configuración financiera:', error);
        }
    },

    async syncTratamientos() {
        try {
            const count = await db.tratamientosHabituales.count();
            if (count > 0) {
                // Si ya hay tratamientos (aprendidos o cargados), no sobrescribimos para no borrar aprendizaje usuario
                // En una versión más avanzada podríamos hacer merge inteligente
                return;
            }

            console.log('📥 Cargando tratamientos iniciales...');
            const response = await fetch(TRATAMIENTOS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data: TratamientoHabitual[] = await response.json();

            // Agregar fecha de creación/uso
            const tratamientosConFecha = data.map(t => ({
                ...t,
                usoCount: 1, // Inicializar con 1 uso para que aparezcan
                fechaUltimoUso: new Date()
            }));

            await db.transaction('rw', db.tratamientosHabituales, async () => {
                await db.tratamientosHabituales.bulkAdd(tratamientosConFecha);
            });
            console.log(`✅ ${data.length} tratamientos iniciales cargados.`);

        } catch (error) {
            console.error('Errors syncing tratamientos:', error);
        }
    },

    /**
     * Sincroniza el catálogo de medicamentos desde /data/medicamentos-v1.json
     */
    async syncMedicamentos() {
        try {
            const response = await fetch(MEDICAMENTOS_URL);
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
            if (error instanceof Error) {
                console.error('Mensaje:', error.message);
                console.error('Stack:', error.stack);
            }
        }
    },

    /**
     * Sincroniza el catálogo de diagnósticos desde /data/diagnosticos-v1.json
     */
    async syncDiagnosticos() {
        try {
            const response = await fetch(DIAGNOSTICOS_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const diagnosticosExternos: DiagnosticoCatalogo[] = await response.json();

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
    },

    /**
     * Sincroniza el catálogo de especialidades desde /data/especialidades-v1.json
     */
    async syncEspecialidades() {
        try {
            const response = await fetch(ESPECIALIDADES_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const especialidadesExternas: EspecialidadCatalogo[] = await response.json();

            await db.transaction('rw', db.especialidades, async () => {
                for (const esp of especialidadesExternas) {
                    // Verificar si ya existe por ID
                    const existing = await db.especialidades.where('id').equals(esp.id).first();

                    if (existing) {
                        // Actualizar especialidad existente
                        await db.especialidades.put(esp);
                    } else {
                        // Insertar nueva especialidad
                        await db.especialidades.add(esp);
                    }
                }
            });
            console.log(`🏥 Especialidades sincronizadas: ${especialidadesExternas.length} items procesados.`);

        } catch (error) {
            console.error('Error sincronizando especialidades:', error);
        }
    }
};
