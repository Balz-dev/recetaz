/**
 * @fileoverview Configuración de Base de Datos IndexedDB
 * 
 * Este archivo configura la base de datos local del sistema usando Dexie.js,
 * un wrapper moderno sobre IndexedDB que facilita las operaciones de base de datos.
 * 
 * La base de datos almacena:
 * - Configuración del médico (singleton)
 * - Pacientes (directorio completo)
 * - Recetas médicas (con historial completo)
 * - Movimientos financieros (ingresos y gastos)
 * - Configuración financiera (costos de consulta)
 * 
 * El sistema funciona completamente offline gracias a IndexedDB.
 * Todas las operaciones son locales y no requieren conexión a internet.
 */

import Dexie, { Table } from 'dexie';
import { MedicoConfig, Paciente, Receta, MovimientoFinanciero, ConfiguracionFinanciera } from '@/types';

/**
 * Clase principal de la base de datos.
 * 
 * Extiende Dexie para proporcionar tipado TypeScript completo
 * y definir el esquema de todas las tablas del sistema.
 * 
 * Versiones:
 * - v1: Esquema inicial (medico, pacientes, recetas)
 * - v2: Agregado índice createdAt para recetas
 * - v3: Agregado módulo de finanzas (finanzas, configuracionFinanciera)
 */
class RecetasDatabase extends Dexie {
    /** Tabla de configuración del médico (singleton) */
    medico!: Table<MedicoConfig>;
    
    /** Tabla de pacientes del consultorio */
    pacientes!: Table<Paciente>;
    
    /** Tabla de recetas médicas emitidas */
    recetas!: Table<Receta>;
    
    /** Tabla de movimientos financieros (ingresos y gastos) */
    finanzas!: Table<MovimientoFinanciero>;
    
    /** Tabla de configuración financiera (costos de consulta) */
    configuracionFinanciera!: Table<ConfiguracionFinanciera>;

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

        // Versión 3: Módulo de Finanzas
        this.version(3).stores({
            medico: 'id',
            pacientes: 'id, nombre, cedula',
            recetas: 'id, numeroReceta, pacienteId, fechaEmision, createdAt',
            finanzas: 'id, tipo, fecha, categoria',
            configuracionFinanciera: 'id'
        });
    }
}

/**
 * Instancia única de la base de datos.
 * Esta es la instancia que se debe importar en todos los servicios.
 * 
 * @example
 * import { db } from '@/shared/db/db.config';
 * const pacientes = await db.pacientes.toArray();
 */
export const db = new RecetasDatabase();
