/**
 * @fileoverview Servicio de gestión de medicamentos
 * 
 * Proporciona funciones optimizadas para:
 * - Búsqueda rápida con autocompletado
 * - CRUD completo de medicamentos
 * - Validación de duplicados
 * - Seguimiento de uso y popularidad
 * - Normalización de texto para búsqueda
 * 
 * Optimizado para PWA offline-first con Dexie.js
 */

import { db } from '@/shared/db/db.config';
import { MedicamentoCatalogo } from '@/types';

/**
 * Normaliza texto para búsqueda eliminando acentos y convirtiendo a minúsculas
 * 
 * @param texto - Texto a normalizar
 * @returns Texto normalizado (lowercase, sin acentos, sin espacios extra)
 * 
 * @example
 * normalizarTexto("Paracetamol 500mg") // "paracetamol 500mg"
 * normalizarTexto("Ácido Fólico")      // "acido folico"
 */
export function normalizarTexto(texto: string): string {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' '); // Reemplazar múltiples espacios por uno solo
}

/**
 * Genera palabras clave para búsqueda a partir de los datos del medicamento
 */
function generarPalabrasClave(medicamento: Partial<MedicamentoCatalogo>): string[] {
    const palabras = new Set<string>();

    // Función auxiliar para agregar palabras
    const agregar = (texto?: string) => {
        if (!texto) return;
        const normalizado = normalizarTexto(texto);
        // Agregar frase completa
        palabras.add(normalizado);
        // Agregar palabras individuales si son significativas (> 2 caracteres)
        normalizado.split(' ').forEach(p => {
            if (p.length > 2) palabras.add(p);
        });
    };

    agregar(medicamento.nombre);
    agregar(medicamento.nombreGenerico);
    agregar(medicamento.categoria);
    agregar(medicamento.laboratorio);
    // Agregar ID remoto o claves si existen
    if (medicamento.idRemoto) palabras.add(medicamento.idRemoto.toLowerCase());

    // Agregar palabras clave manuales si existen
    if (medicamento.palabrasClave) {
        medicamento.palabrasClave.forEach(p => palabras.add(p.toLowerCase()));
    }

    return Array.from(palabras);
}

/**
 * Obtiene todos los medicamentos con filtros y paginación.
 * 
 * @param filtros - Opciones de filtrado
 * @param paginacion - Opciones de paginación
 * @returns Array de medicamentos
 */
export async function obtenerMedicamentos(
    filtros?: {
        categoria?: string;
        soloPersonalizados?: boolean;
        ordenarPor?: 'nombre' | 'uso' | 'reciente';
        busqueda?: string;
    },
    paginacion?: { offset: number; limit: number }
): Promise<MedicamentoCatalogo[]> {
    let medicamentos: MedicamentoCatalogo[] = [];

    // Estrategia: Obtener datos base según filtros principales
    if (filtros?.categoria) {
        medicamentos = await db.medicamentos
            .where('categoria')
            .equals(filtros.categoria)
            .toArray();
    } else if (filtros?.soloPersonalizados) {
        medicamentos = await db.medicamentos
            .filter(m => m.esPersonalizado === true)
            .toArray();
    } else {
        // Sin filtros específicos, obtener todos
        medicamentos = await db.medicamentos.toArray();
    }

    // Filtrar por búsqueda si existe
    if (filtros?.busqueda && filtros.busqueda.trim().length > 0) {
        const queryNormalizada = normalizarTexto(filtros.busqueda);
        const terminosBusqueda = queryNormalizada.split(' ').filter(t => t.length > 2);

        medicamentos = medicamentos.filter(med => {
            // Coincidencia directa en nombre
            if (med.nombreBusqueda.includes(queryNormalizada)) return true;
            // Coincidencia en genérico
            if (med.nombreGenerico && normalizarTexto(med.nombreGenerico).includes(queryNormalizada)) return true;

            // Coincidencia en palabras clave (si existen)
            if (med.palabrasClave && terminosBusqueda.length > 0) {
                return terminosBusqueda.some(t =>
                    med.palabrasClave!.some(k => k.includes(t))
                );
            }
            return false;
        });
    }

    return aplicarOrdenamientoYPaginacion(medicamentos, filtros, paginacion);
}

/**
 * Busca medicamentos para autocompletado con optimización de rendimiento y palabras clave.
 * 
 * Estrategia de búsqueda mejorada (v8):
 * 1. Búsqueda exacta por inicio de nombre (muy rápido)
 * 2. Búsqueda por palabras clave usando índice MultiEntry (*palabrasClave)
 * 
 * @param query - Término de búsqueda
 * @param limit - Límite de resultados
 */
export async function buscarMedicamentosAutocompletado(
    query: string,
    limit: number = 10
): Promise<MedicamentoCatalogo[]> {
    if (!query || query.trim().length < 2) {
        return await db.medicamentos
            .orderBy('vecesUsado')
            .reverse()
            .limit(limit)
            .toArray();
    }

    const queryNormalizada = normalizarTexto(query);
    const terminosBusqueda = queryNormalizada.split(' ').filter(t => t.length > 2);

    // 1. Intentar búsqueda directa por prefijo (lo más rápido y común)
    let resultados = await db.medicamentos
        .where('nombreBusqueda')
        .startsWithIgnoreCase(queryNormalizada)
        .limit(limit)
        .toArray();

    // 2. Si faltan resultados, usar índice de palabras clave
    if (resultados.length < limit && terminosBusqueda.length > 0) {
        // Buscamos medicamentos que contengan CUALQUIER término (OR implícito optimizado)
        // Para "paracetamol infantil", buscará ambos tokens en el índice
        const keywordsResults = await db.medicamentos
            .where('palabrasClave')
            .anyOfIgnoreCase(terminosBusqueda)
            .distinct() // Dexie distinct para evitar duplicados en la query
            .limit(limit * 2)
            .toArray();

        // Filtrado en memoria secundario para asegurar relevancia (AND lógico si se prefiere)
        // O simplemente agregar los que no estén ya
        const idsExistentes = new Set(resultados.map(r => r.id));

        for (const med of keywordsResults) {
            if (!idsExistentes.has(med.id)) {
                resultados.push(med);
                idsExistentes.add(med.id);
            }
            if (resultados.length >= limit) break;
        }
    }

    return resultados.slice(0, limit);
}

/**
 * Agrega un nuevo medicamento generando palabras clave automáticamente.
 */
export async function agregarMedicamento(
    medicamento: Omit<MedicamentoCatalogo, 'id' | 'nombreBusqueda' | 'fechaCreacion' | 'vecesUsado'>
): Promise<number> {
    const nombreBusqueda = normalizarTexto(medicamento.nombre);

    // Generar palabras clave automáticas
    const palabrasClave = generarPalabrasClave(medicamento);

    const existente = await db.medicamentos
        .where('nombreBusqueda')
        .equals(nombreBusqueda)
        .first();

    if (existente) {
        await db.medicamentos.update(existente.id!, {
            vecesUsado: existente.vecesUsado + 1,
            fechaUltimoUso: new Date(),
            // Actualizar palabras clave por si cambiaron reglas
            palabrasClave
        });
        return existente.id!;
    }

    const nuevoMedicamento: Omit<MedicamentoCatalogo, 'id'> = {
        ...medicamento,
        nombreBusqueda,
        palabrasClave,
        vecesUsado: 1,
        fechaCreacion: new Date(),
        fechaUltimoUso: new Date(),
    };

    return await db.medicamentos.add(nuevoMedicamento as any);
}

/**
 * Actualiza un medicamento y regenera sus palabras clave.
 */
export async function actualizarMedicamento(
    id: number,
    cambios: Partial<Omit<MedicamentoCatalogo, 'id' | 'fechaCreacion'>>
): Promise<void> {
    const medicamentoActual = await db.medicamentos.get(id);
    if (!medicamentoActual) return;

    const medicamentoFusionado = { ...medicamentoActual, ...cambios };

    // Regenerar derivados
    if (cambios.nombre) {
        cambios.nombreBusqueda = normalizarTexto(cambios.nombre);
    }

    // Siempre regenerar palabras clave al actualizar cualquier campo relevante
    if (cambios.nombre || cambios.nombreGenerico || cambios.categoria || cambios.palabrasClave) {
        // Nota: Si 'cambios.palabrasClave' viene del UI, generarPalabrasClave lo incluirá
        // Se asume que el UI pasa las "extra" keywords en un array si es edición manual
        const nuevasKeywords = generarPalabrasClave(medicamentoFusionado);
        (cambios as any).palabrasClave = nuevasKeywords;
    }

    await db.medicamentos.update(id, cambios);
}

/**
 * Función auxiliar para aplicar ordenamiento y paginación
 */
function aplicarOrdenamientoYPaginacion(
    medicamentos: MedicamentoCatalogo[],
    filtros?: { ordenarPor?: 'nombre' | 'uso' | 'reciente' },
    paginacion?: { offset: number; limit: number }
): MedicamentoCatalogo[] {
    // Ordenamiento
    if (filtros?.ordenarPor === 'uso') {
        medicamentos.sort((a, b) => b.vecesUsado - a.vecesUsado);
    } else if (filtros?.ordenarPor === 'reciente') {
        medicamentos.sort((a, b) => {
            const fechaA = a.fechaUltimoUso?.getTime() || 0;
            const fechaB = b.fechaUltimoUso?.getTime() || 0;
            return fechaB - fechaA;
        });
    } else {
        // Ordenar por nombre (alfabético)
        medicamentos.sort((a, b) => a.nombreBusqueda.localeCompare(b.nombreBusqueda));
    }

    // Paginación
    if (paginacion) {
        return medicamentos.slice(paginacion.offset, paginacion.offset + paginacion.limit);
    }

    return medicamentos;
}

/**
 * Obtiene un medicamento por su ID
 * 
 * @param id - ID del medicamento
 * @returns Medicamento o undefined si no existe
 */
export async function obtenerMedicamentoPorId(id: number): Promise<MedicamentoCatalogo | undefined> {
    return await db.medicamentos.get(id);
}

/**
 * Elimina un medicamento del catálogo
 * 
 * @param id - ID del medicamento a eliminar
 * 
 * @example
 * await eliminarMedicamento(42);
 */
export async function eliminarMedicamento(id: number): Promise<void> {
    await db.medicamentos.delete(id);
}

/**
 * Registra el uso de un medicamento en una receta.
 * Incrementa contador de uso y actualiza fecha de último uso.
 * 
 * @param identificador - ID (number) o Nombre (string) del medicamento utilizado
 */
export async function registrarUsoMedicamento(identificador: string | number): Promise<void> {
    if (!identificador) return;

    let medicamentoId: number | undefined;

    if (typeof identificador === 'number') {
        medicamentoId = identificador;
    } else {
        // Buscar por nombre
        const normalizado = normalizarTexto(identificador);

        // Intentar buscar por nombre de búsqueda exacto primero
        let medicamento = await db.medicamentos
            .where('nombreBusqueda')
            .equals(normalizado)
            .first();

        // Si no encuentra exacto, intentar encontrar el que empiece con ese nombre
        if (!medicamento) {
            medicamento = (await db.medicamentos
                .where('nombreBusqueda')
                .startsWith(normalizado)
                .limit(1)
                .toArray())[0];
        }

        if (medicamento) {
            medicamentoId = medicamento.id;
        }
    }

    if (medicamentoId) {
        // Verificar que exista antes de actualizar para evitar errores
        const existe = await db.medicamentos.get(medicamentoId);
        if (existe) {
            await db.medicamentos.update(medicamentoId, {
                vecesUsado: (existe.vecesUsado || 0) + 1,
                fechaUltimoUso: new Date()
            });
        }
    }
}

/**
 * Obtiene estadísticas del catálogo de medicamentos
 * 
 * @returns Objeto con estadísticas del catálogo
 */
export async function obtenerEstadisticasMedicamentos(): Promise<{
    total: number;
    personalizados: number;
    delCatalogo: number;
    categorias: string[];
}> {
    const todosMedicamentos = await db.medicamentos.toArray();

    const personalizados = todosMedicamentos.filter(m => m.esPersonalizado).length;
    const delCatalogo = todosMedicamentos.length - personalizados;

    const categoriasSet = new Set<string>();
    todosMedicamentos.forEach(m => {
        if (m.categoria) {
            categoriasSet.add(m.categoria);
        }
    });

    return {
        total: todosMedicamentos.length,
        personalizados,
        delCatalogo,
        categorias: Array.from(categoriasSet).sort(),
    };
}
