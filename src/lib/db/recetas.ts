import { db } from './index';
import { Receta, RecetaFormData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const recetaService = {
    /**
     * Obtiene todas las recetas ordenadas por fecha de emisión descendente (más recientes primero).
     * @returns Promesa con lista de recetas.
     */
    async getAll(): Promise<Receta[]> {
        return await db.recetas.orderBy('fechaEmision').reverse().toArray();
    },

    /**
     * Obtiene el historial de recetas de un paciente específico.
     * @param pacienteId ID del paciente
     * @returns Lista de recetas del paciente ordenadas por fecha (más recientes primero)
     */
    async getByPacienteId(pacienteId: string): Promise<Receta[]> {
        return await db.recetas
            .where('pacienteId')
            .equals(pacienteId)
            .reverse()
            .sortBy('fechaEmision');
    },

    /**
     * Obtiene una receta específica por su ID.
     * @param id ID de la receta
     * @returns La receta encontrada o undefined
     */
    async getById(id: string): Promise<Receta | undefined> {
        return await db.recetas.get(id);
    },

    /**
     * Genera el siguiente número de receta consecutivo.
     * Busca la última receta creada y suma 1 a su número.
     * Formato: 4 dígitos con ceros a la izquierda (ej: 0005).
     * @returns Nuevo número de receta formateado
     */
    async getNextNumeroReceta(): Promise<string> {
        // Usamos el índice createdAt para encontrar la última receta creada de forma eficiente
        const lastReceta = await db.recetas.orderBy('createdAt').last();

        if (!lastReceta) return '0001';

        const lastNum = parseInt(lastReceta.numeroReceta);
        return (lastNum + 1).toString().padStart(4, '0');
    },

    /**
     * Crea una nueva receta médica.
     * - Genera un UUID único.
     * - Calcula el número de receta consecutivo.
     * - Desnormaliza datos básicos del paciente para persistencia histórica.
     * @param data Datos del formulario de receta
     * @param pacienteData Datos del paciente necesarios para la receta
     * @returns ID de la nueva receta
     */
    async create(data: RecetaFormData, pacienteData: { nombre: string, edad: number }): Promise<string> {
        const numeroReceta = await this.getNextNumeroReceta();

        const receta: Receta = {
            ...data,
            id: uuidv4(),
            numeroReceta,
            fechaEmision: new Date(),
            medicamentos: data.medicamentos.map(m => ({ ...m, id: uuidv4() })),
            // Guardamos copia de datos del paciente para que la receta sea inmutable
            // aunque cambien los datos del paciente en el futuro
            pacienteNombre: pacienteData.nombre,
            pacienteEdad: pacienteData.edad,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return await db.recetas.add(receta);
    },

    /**
     * Elimina una receta permanentemente.
     * @param id ID de la receta a eliminar
     */
    async delete(id: string): Promise<void> {
        await db.recetas.delete(id);
    },

    /**
     * Busca recetas por número de folio o nombre del paciente.
     * @param query Texto a buscar
     * @returns Lista de recetas coincidentes
     */
    async search(query: string): Promise<Receta[]> {
        const lowerQuery = query.toLowerCase();
        return await db.recetas
            .filter(r =>
                r.numeroReceta.includes(query) ||
                r.pacienteNombre.toLowerCase().includes(lowerQuery)
            )
            .reverse()
            .sortBy('fechaEmision');
    }
};
