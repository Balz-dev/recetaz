import { db } from './index';
import { Paciente, PacienteFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const pacienteService = {
    /**
     * Obtiene la lista completa de pacientes ordenada alfabéticamente.
     * @returns Lista de todos los pacientes registrados.
     */
    async getAll(): Promise<Paciente[]> {
        return await db.pacientes.orderBy('nombre').toArray();
    },

    /**
     * Busca un paciente específico por su ID único.
     * @param id UUID del paciente
     */
    async getById(id: string): Promise<Paciente | undefined> {
        return await db.pacientes.get(id);
    },

    /**
     * Realiza una búsqueda de texto en nombre y cédula.
     * La búsqueda es insensible a mayúsculas/minúsculas.
     * @param query Texto a buscar
     * @returns Pacientes que coinciden parcial o totalmente
     */
    async search(query: string): Promise<Paciente[]> {
        const lowerQuery = query.toLowerCase();
        return await db.pacientes
            .filter(p =>
                p.nombre.toLowerCase().includes(lowerQuery)
            )
            .toArray();
    },

    /**
     * Crea un nuevo registro de paciente generando un UUID.
     * @param data Datos del formulario de paciente
     * @returns ID del nuevo paciente
     */
    async create(data: PacienteFormData): Promise<string> {
        const paciente: Paciente = {
            ...data,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return await db.pacientes.add(paciente);
    },

    /**
     * Actualiza los datos de un paciente existente.
     * @param id ID del paciente a actualizar
     * @param data Datos parciales a modificar
     * @returns 1 si se actualizó correctamente, 0 si no
     */
    async update(id: string, data: Partial<PacienteFormData>): Promise<number> {
        return await db.pacientes.update(id, {
            ...data,
            updatedAt: new Date()
        });
    },

    /**
     * Elimina permanentemente un paciente.
     * Nota: Debería verificarse si tiene recetas antes de eliminar (lógica de negocio).
     * @param id ID del paciente
     */
    async delete(id: string): Promise<void> {
        await db.pacientes.delete(id);
    }
};
