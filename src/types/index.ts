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

export interface MedicamentoCatalogo {
    id: string;
    nombre: string;
    nombreGenerico?: string;
    presentacion?: string;
    formaFarmaceutica?: string;
    concentracion?: string;
    cantidadSurtir?: string;
    dosis?: string;
    viaAdministracion?: string;
    frecuencia?: string;
    duracion?: string;
    indicaciones?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type MedicamentoCatalogoFormData = Omit<MedicamentoCatalogo, 'id' | 'createdAt' | 'updatedAt'>;


