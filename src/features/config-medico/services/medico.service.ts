/**
 * @fileoverview Servicio de Configuración del Médico
 * 
 * Este servicio gestiona la configuración profesional del médico que utiliza el sistema.
 * Almacena datos como nombre, cédula profesional, especialidad, dirección del consultorio,
 * teléfono y otros datos que aparecerán en las recetas médicas.
 * 
 * La configuración es única (singleton) y se identifica con un ID estático 'default'.
 * Esto asegura que solo exista una configuración por instalación del sistema.
 */

import { db } from '@/shared/db/db.config';
import { MedicoConfig, MedicoConfigFormData } from '@/types';

/**
 * ID único para la configuración del médico.
 * Al ser un sistema monousuario, solo existe una configuración.
 */
const MEDICO_ID = 'default';

/**
 * Servicio de gestión de configuración del médico.
 * Proporciona métodos para obtener, guardar y verificar la configuración profesional.
 */
export const medicoService = {
    /**
     * Obtiene la configuración actual del médico.
     * Al ser una configuración única, siempre buscamos por el ID estático.
     * @returns Promesa con la configuración o undefined si no existe.
     */
    async get(): Promise<MedicoConfig | undefined> {
        return await db.medico.get(MEDICO_ID);
    },

    /**
     * Guarda o actualiza la configuración del médico.
     * Mantiene la fecha de creación original si ya existe.
     * @param data Datos del formulario de configuración
     * @returns Promesa con el ID del registro guardado
     */
    async save(data: MedicoConfigFormData): Promise<string> {
        const existing = await this.get();

        const medico: MedicoConfig = {
            ...data,
            id: MEDICO_ID,
            // Preservamos createdAt si es una actualización, sino usamos fecha actual
            createdAt: existing?.createdAt || new Date(),
            updatedAt: new Date() // Siempre actualizamos la fecha de modificación
        };

        return await db.medico.put(medico);
    },

    /**
     * Verifica si ya existe una configuración de médico guardada.
     * Útil para determinar si redirigir al setup inicial.
     * @returns true si existe configuración, false si no.
     */
    async exists(): Promise<boolean> {
        const count = await db.medico.count();
        return count > 0;
    }
};
