export interface Paciente {
    id: string;
    nombre: string;
    edad?: number;
    telefono?: string;
    email?: string;
    direccion?: string;
    alergias?: string;
    antecedentes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MedicoConfig {
    id: string;
    nombre: string;
    especialidad: string;
    cedula: string;
    telefono: string;
    direccion: string;
    logo?: string; // Base64 string de imagen del logo institucional
    createdAt: Date;
    updatedAt: Date;
}

export interface Medicamento {
    id: string;
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    indicaciones?: string;
}

export interface Receta {
    id: string;
    numeroReceta: string; // Formato: 0001, 0002, etc.
    pacienteId: string;
    pacienteNombre: string; // Desnormalizado para búsquedas rápidas y persistencia histórica
    pacienteEdad: number;   // Desnormalizado
    diagnostico: string;
    medicamentos: Medicamento[];
    instrucciones: string;
    fechaEmision: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para formularios (sin campos autogenerados)
export type MedicoConfigFormData = Omit<MedicoConfig, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para el formulario de configuración del médico sin el logo (se maneja por separado)
export type MedicoConfigFormDataWithoutLogo = Omit<MedicoConfigFormData, 'logo'>;
export type PacienteFormData = Omit<Paciente, 'id' | 'createdAt' | 'updatedAt'>;
export type RecetaFormData = Omit<Receta, 'id' | 'numeroReceta' | 'createdAt' | 'updatedAt' | 'pacienteNombre' | 'pacienteEdad' | 'medicamentos'> & {
    medicamentos: Omit<Medicamento, 'id'>[];
};
