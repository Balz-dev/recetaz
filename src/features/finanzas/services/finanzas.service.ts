/**
 * @fileoverview Servicio de Finanzas
 * 
 * Este servicio gestiona toda la lógica relacionada con las finanzas del consultorio médico.
 * Permite configurar el costo de consulta, calcular ganancias basadas en recetas emitidas,
 * y generar reportes de ingresos para análisis financiero.
 * 
 * La ganancia se calcula multiplicando el número de recetas emitidas por el costo de consulta
 * configurado. Esta información se almacena en IndexedDB para análisis histórico.
 */

import { db } from '@/shared/db/db.config';
import { ConfiguracionFinanciera } from '@/types';
import { subDays, startOfDay, endOfDay, format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Servicio de gestión financiera del consultorio.
 * Proporciona métodos para configurar costos y calcular ganancias.
 */
export const finanzasService = {
    /**
     * Obtiene la configuración financiera actual.
     * Si no existe, crea una por defecto con costo de consulta de $500.
     */
    async getConfig(): Promise<ConfiguracionFinanciera> {
        const config = await db.configuracionFinanciera.get('default');
        if (!config) {
            const defaultConfig: ConfiguracionFinanciera = {
                id: 'default',
                costoConsulta: 500,
                updatedAt: new Date()
            };
            await db.configuracionFinanciera.add(defaultConfig);
            return defaultConfig;
        }
        return config;
    },

    /**
     * Actualiza el costo de la consulta.
     */
    async updateCostoConsulta(costo: number): Promise<void> {
        await db.configuracionFinanciera.put({
            id: 'default',
            costoConsulta: costo,
            updatedAt: new Date()
        });
    },

    /**
     * Calcula las ganancias de los últimos 7 días.
     * Ganancia = (Número de recetas del día) * (Costo de consulta actual)
     */
    async getGananciasUltimos7Dias(): Promise<{ fecha: string; ganancia: number; recetas: number }[]> {
        const config = await this.getConfig();
        const costo = config.costoConsulta;
        const result = [];

        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const start = startOfDay(date);
            const end = endOfDay(date);

            // Contar recetas emitidas en ese rango de tiempo
            const count = await db.recetas
                .where('fechaEmision')
                .between(start, end)
                .count();

            result.push({
                fecha: format(date, 'EEE dd', { locale: es }), // Ej: "Lun 06"
                ganancia: count * costo,
                recetas: count
            });
        }
        return result;
    }
};
