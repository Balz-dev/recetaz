export interface Paciente {
    id: string;
    nombre: string;
    edad?: number;
    direccion?: string;
    alergias?: string;
    antecedentes?: string;
    peso?: string; // Permitir "70 kg" o solo "70"
    talla?: string; // Permitir "1.75 m" o "175 cm"
    // Campos dinámicos de especialidad
    datosEspecificos?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface MedicoConfig {
    id: string;
    nombre: string;
    especialidad: string;
    // Clave de la especialidad para campos dinámicos (ej: 'pediatria', 'ginecologia')
    especialidadKey?: string;
    cedula: string;
    telefono: string;
    direccion?: string;
    institucion_gral?: string;
    correo?: string;
    logo?: string; // Base64 string de imagen del logo institucional
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Representa un medicamento prescrito dentro de una receta.
 */
export interface Medicamento {
    id: string;
    /** Nombre completo o comercial del medicamento */
    nombre: string;
    /** Nombre genérico (DCI) */
    nombreGenerico?: string;
    /** Detalle de la presentación (ej: Tabletas, Jarabe) */
    presentacion?: string;
    /** Forma farmacéutica estandarizada */
    formaFarmaceutica?: string;
    /** Concentración del principio activo (ej: 500mg) */
    concentracion?: string;
    /** Cantidad a surtir (ej: 1 caja, 20 tabletas) */
    cantidadSurtir?: string;
    /** Dosis prescrita (ej: 1 tableta, 5ml) */
    dosis: string;
    /** Vía de administración (ej: Oral, Intravenosa) */
    viaAdministracion?: string;
    /** Frecuencia de la toma (ej: Cada 8 horas) */
    frecuencia: string;
    /** Duración del tratamiento */
    duracion: string;
    /** Indicaciones adicionales para el paciente */
    indicaciones?: string;
}

export interface Receta {
    id: string;
    numeroReceta: string; // Formato: 0001, 0002, etc.
    pacienteId: string;
    pacienteNombre: string; // Desnormalizado para búsquedas rápidas y persistencia histórica
    pacienteEdad: number;   // Desnormalizado
    peso?: string;          // Desnormalizado (Snapshot)
    talla?: string;         // Desnormalizado (Snapshot)
    // Campos dinámicos de especialidad en receta (ej: T/A, FUM, temperatura)
    datosEspecificos?: Record<string, any>;
    diagnostico: string;
    medicamentos: Medicamento[];
    instrucciones?: string;
    fechaEmision: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para formularios (sin campos autogenerados)
export type MedicoConfigFormData = Omit<MedicoConfig, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para el formulario de configuración del médico sin el logo (se maneja por separado)
export type MedicoConfigFormDataWithoutLogo = Omit<MedicoConfigFormData, 'logo'>;
export type PacienteFormData = {
    nombre: string;
    edad?: number;
    direccion?: string;
    alergias?: string;
    antecedentes?: string;
    peso?: string;
    talla?: string;
    datosEspecificos?: Record<string, any>;
    //cedula?: string;
};
export type RecetaFormData = {
    // Paciente: puede ser ID existente o datos para crear nuevo
    pacienteId?: string;
    pacienteNombre: string;
    pacienteEdad?: number;
    pacienteDireccion?: string;
    pacienteCedula?: string;
    pacientePeso?: string;
    pacienteTalla?: string;
    // Datos de la receta
    diagnostico: string;
    medicamentos: Omit<Medicamento, 'id'>[];
    instrucciones?: string;
    datosEspecificos?: Record<string, any>;
};

export interface MovimientoFinanciero {
    id: string;
    tipo: 'ingreso' | 'gasto';
    categoria: string; // 'consulta', 'farmacia', 'operacion', 'honorarios'
    concepto: string;
    monto: number;
    fecha: Date;
    createdAt: Date;
}

export interface ConfiguracionFinanciera {
    id: string; // 'default'
    costoConsulta: number;
    updatedAt: Date;
}


export type MovimientoFinancieroFormData = Omit<MovimientoFinanciero, 'id' | 'createdAt'>;

export interface CampoPlantilla {
    id: string;             // Identificador único del campo (ej: "paciente_nombre")
    etiqueta: string;       // Nombre visible (ej: "Nombre del Paciente")
    x: number;              // Posición X en porcentajes (0-100)
    y: number;              // Posición Y en porcentajes (0-100)
    ancho: number;          // Ancho en px o %
    alto?: number;          // Alto en px o % (opcional)
    visible: boolean;       // Si se imprime o no
    tipo: 'texto' | 'fecha' | 'lista' | 'imagen'; // Tipo de dato
    ejemplo?: string;       // Texto de ejemplo para previsualización
    src?: string;           // Base64 para imagenes (Logo)
}

export interface PlantillaReceta {
    id: string;
    nombre: string;
    tamanoPapel: 'carta' | 'media_carta';
    imagenFondo?: string;   // Base64 de la imagen subida
    campos: CampoPlantilla[];
    activa: boolean;        // Solo una puede estar activa por defecto
    imprimirFondo: boolean; // Si true, imprime la imagen. Si false, solo los datos
    createdAt: Date;
    updatedAt: Date;
}

export type PlantillaRecetaFormData = Omit<PlantillaReceta, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Representa un medicamento en el catálogo del sistema.
 * Optimizado para búsqueda rápida, autocompletado y seguimiento de uso.
 */
export interface MedicamentoCatalogo {
    /** Identificador único auto-incremental */
    id?: number;

    /** Nombre comercial o completo del medicamento */
    nombre: string;

    /** Nombre genérico o principio activo (DCI) */
    nombreGenerico?: string;

    /** Nombre normalizado para búsqueda (lowercase, sin acentos) */
    nombreBusqueda: string;

    /** Presentación del medicamento (ej: "Tabletas 500mg", "Jarabe 120ml") */
    presentacion?: string;

    /** Forma farmacéutica estandarizada */
    formaFarmaceutica?: string;

    /** Concentración del principio activo */
    concentracion?: string;

    /** Categoría terapéutica (ej: "Antibiótico", "Analgésico", "Antihipertensivo") */
    categoria?: string;

    /** Laboratorio o fabricante */
    laboratorio?: string;

    // Valores predeterminados clínicos (se autocompletan al seleccionar el medicamento)
    /** Cantidad a surtir predeterminada */
    cantidadSurtirDefault?: string;

    /** Dosis predeterminada (ej: "1 tableta", "5ml") */
    dosisDefault?: string;

    /** Vía de administración predeterminada (ej: "Oral", "Intravenosa") */
    viaAdministracionDefault?: string;

    /** Frecuencia predeterminada (ej: "Cada 8 horas") */
    frecuenciaDefault?: string;

    /** Duración predeterminada del tratamiento (ej: "7 días") */
    duracionDefault?: string;

    /** Indicaciones predeterminadas para el paciente */
    indicacionesDefault?: string;

    // Metadatos y seguimiento
    /** True si lo agregó el médico, false si viene del catálogo inicial */
    esPersonalizado: boolean;

    /** Contador de veces que se ha usado en recetas */
    vecesUsado: number;

    /** Fecha de creación del registro */
    fechaCreacion: Date;

    /** Fecha del último uso en una receta */
    fechaUltimoUso?: Date;

    // Para sincronización futura (opcional)
    /** Indica si ha sido sincronizado con servidor remoto */
    sincronizado?: boolean;

    /** ID del medicamento en servidor remoto */
    idRemoto?: string;

    /** Palabras clave para búsqueda (genérico, comerciales, abreviaturas) */
    palabrasClave?: string[];

    // Campos adicionales COFEPRIS y Especialidad
    /** Registro Sanitario (COFEPRIS) */
    registroSanitario?: string;

    /** Especialidades médicas sugeridas para este medicamento */
    especialidad?: string[];
}

/**
 * Catálogo de diagnósticos basado en CIE-11
 */
export interface DiagnosticoCatalogo {
    id?: number;
    codigo: string;       // Código CIE-11 (ej: "MG44")
    nombre: string;       // Título oficial
    uri?: string;         // URI de la entidad en CIE-11 Foundation
    sinonimos?: string[]; // Términos alternativos para facilitar búsqueda
    especialidad?: string[]; // Especialidades relacionadas
    palabrasClave?: string[]; // Tokens normalizados para búsqueda
}

/**
 * Representa un tratamiento habitual aprendido o preconfigurado
 * Asocia un diagnóstico con una lista de medicamentos e instrucciones.
 */
export interface TratamientoHabitual {
    id?: number;
    diagnosticoId: string; // Código o ID del diagnóstico asociado
    nombreTratamiento: string; // Nombre amigable (ej: "Tratamiento estándar faringitis")
    medicamentos: Partial<Medicamento>[]; // Lista de medicamentos plantilla
    instrucciones?: string; // Instrucciones generales
    especialidad?: string; // Especialidad del médico que creó este patrón
    usoCount: number; // Frecuencia de uso (para ranking)
    fechaUltimoUso: Date;
}

export type MedicamentoCatalogoFormData = Omit<MedicamentoCatalogo, 'id' | 'nombreBusqueda' | 'vecesUsado' | 'fechaCreacion' | 'fechaUltimoUso'>;


