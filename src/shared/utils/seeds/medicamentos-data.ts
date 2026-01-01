/**
 * @fileoverview Datos de catálogo de medicamentos comunes en México
 * 
 * Este archivo centraliza el acceso al catálogo de medicamentos.
 * Ahora importa el catálogo extenso generado con el Cuadro Básico del Sector Salud.
 */

import { catalogoMedicamentosExtenso } from './medicamentos-full-data';

/**
 * Catálogo de medicamentos comunes en México
 * Exportado con el nombre original para mantener compatibilidad
 */
export const catalogoMedicamentosInicial = catalogoMedicamentosExtenso;
