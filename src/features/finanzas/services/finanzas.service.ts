import { db } from '@/shared/db/db.config';
import { ConfiguracionFinanciera } from '@/types';
import {
    subDays,
    startOfDay,
    endOfDay,
    format,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    eachWeekOfInterval,
    addDays,
    isSameDay
} from 'date-fns';
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
     * Calcula las ganancias agregadas por mes para un año específico.
     */
    async getGananciasPorAnio(anio: number): Promise<{ label: string; ganancia: number; recetas: number }[]> {
        const config = await this.getConfig();
        const costo = config.costoConsulta;
        const result = [];

        const fechaReferencia = new Date(anio, 0, 1);
        const meses = eachMonthOfInterval({
            start: startOfYear(fechaReferencia),
            end: endOfYear(fechaReferencia)
        });

        for (const mes of meses) {
            const count = await db.recetas
                .where('fechaEmision')
                .between(startOfMonth(mes), endOfMonth(mes))
                .count();

            result.push({
                label: format(mes, 'MMM', { locale: es }).toUpperCase(),
                ganancia: count * costo,
                recetas: count
            });
        }
        return result;
    },

    /**
     * Calcula las ganancias agregadas por semana para un mes/anio específico.
     */
    async getGananciasPorMes(mes: number, anio: number): Promise<{ label: string; ganancia: number; recetas: number }[]> {
        const config = await this.getConfig();
        const costo = config.costoConsulta;
        const result = [];

        const fechaReferencia = new Date(anio, mes, 1);
        const semanas = eachWeekOfInterval({
            start: startOfMonth(fechaReferencia),
            end: endOfMonth(fechaReferencia)
        }, { locale: es, weekStartsOn: 1 });

        for (let i = 0; i < semanas.length; i++) {
            const start = semanas[i];
            const end = endOfDay(endOfWeek(start, { locale: es, weekStartsOn: 1 }));

            // Asegurarnos que no nos pasamos del fin de mes para el último intervalo
            const endOfM = endOfMonth(fechaReferencia);
            const actualEnd = end > endOfM ? endOfM : end;

            const count = await db.recetas
                .where('fechaEmision')
                .between(start, actualEnd)
                .count();

            result.push({
                label: `Sem ${i + 1}`,
                ganancia: count * costo,
                recetas: count
            });
        }
        return result;
    },

    /**
     * Calcula las ganancias agregadas por día para una semana específica.
     */
    async getGananciasPorSemana(fechaInicio: Date): Promise<{ label: string; ganancia: number; recetas: number }[]> {
        const config = await this.getConfig();
        const costo = config.costoConsulta;
        const result = [];

        const dias = eachDayOfInterval({
            start: startOfWeek(fechaInicio, { locale: es, weekStartsOn: 1 }),
            end: endOfWeek(fechaInicio, { locale: es, weekStartsOn: 1 })
        });

        for (const dia of dias) {
            const count = await db.recetas
                .where('fechaEmision')
                .between(startOfDay(dia), endOfDay(dia))
                .count();

            result.push({
                label: format(dia, 'EEE dd', { locale: es }),
                ganancia: count * costo,
                recetas: count
            });
        }
        return result;
    },

    /**
     * Legacy: Calcula las ganancias de los últimos 7 días.
     */
    async getGananciasUltimos7Dias(): Promise<{ fecha: string; ganancia: number; recetas: number }[]> {
        const result = await this.getGananciasPorSemana(subDays(new Date(), 6));
        return result.map(d => ({ fecha: d.label, ganancia: d.ganancia, recetas: d.recetas }));
    }
};
