import Dexie, { Table } from 'dexie';
import { MedicoConfig, Paciente, Receta } from '@/types';

/**
 * Configuración principal de la base de datos IndexedDB usando Dexie.
 * Gestiona el almacenamiento local persistence offline-first.
 */
class RecetasDatabase extends Dexie {
    medico!: Table<MedicoConfig>;
    pacientes!: Table<Paciente>;
    recetas!: Table<Receta>;

    constructor() {
        super('RecetasMedicasDB');

        // Definición de esquemas de la base de datos
        // La versión 2 agrega el índice 'createdAt' a recetas para ordenamiento
        this.version(2).stores({
            // Tabla de configuración del médico
            // Solo existirá un registro con id 'default'
            medico: 'id',

            // Tabla de pacientes
            // Índices:
            // - id: Identificador único (UUID)
            // - nombre: Para búsquedas alfabéticas y filtrado
            // - cedula: Para búsquedas exactas de identificación
            pacientes: 'id, nombre, cedula',

            // Tabla de recetas médicas
            // Índices:
            // - id: Identificador único (UUID)
            // - numeroReceta: Para búsqueda por folio
            // - pacienteId: Clave foránea para relacionar con pacientes
            // - fechaEmision: Para ordenar historial y reportes
            // - createdAt: Para obtener la última receta creada (necesario para autoincremental)
            recetas: 'id, numeroReceta, pacienteId, fechaEmision, createdAt'
        });
    }
}

export const db = new RecetasDatabase();
