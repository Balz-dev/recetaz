/**
 * @fileoverview Utilidades para importar y exportar datos en formato JSON
 * 
 * Proporciona funciones para:
 * - Exportar datos a archivos JSON
 * - Importar datos desde archivos JSON
 * - Validar datos importados usando Zod schemas
 */

import { z } from 'zod'

/**
 * Estructura del archivo de exportación con metadatos
 */
export interface ExportWrapper<T> {
    schema: string;
    version: string;
    entity: string;
    exportedAt: string;
    data: T[];
}

/**
 * Exporta datos a un archivo JSON con metadatos de esquema
 * 
 * @param data - Array de datos a exportar
 * @param filename - Nombre del archivo (sin extensión)
 * @param entity - Nombre de la entidad (ej: 'medicamentos')
 */
export function exportToJSON<T>(data: T[], filename: string, entity: string = 'unknown'): void {
    const wrapper: ExportWrapper<T> = {
        schema: 'recetaz-catalog-export',
        version: '1.0.0',
        entity,
        exportedAt: new Date().toISOString(),
        data
    }

    const jsonString = JSON.stringify(wrapper, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Liberar el objeto URL
    URL.revokeObjectURL(url)
}

/**
 * Importa datos desde un archivo JSON, soportando formato nuevo (con esquema) y antiguo (array directo)
 * 
 * @param file - Archivo JSON a importar
 * @returns Promise con el array de datos parseados
 * @throws Error si el archivo no es válido o no se puede leer
 */
export async function importFromJSON<T>(file: File): Promise<T[]> {
    return new Promise((resolve, reject) => {
        if (!file.name.endsWith('.json')) {
            reject(new Error('El archivo debe ser un JSON válido'))
            return
        }

        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string
                const json = JSON.parse(content)

                // Detectar si es el formato nuevo (ExportWrapper)
                if (json && typeof json === 'object' && !Array.isArray(json) && json.schema === 'recetaz-catalog-export') {
                    if (Array.isArray(json.data)) {
                        resolve(json.data)
                        return
                    }
                }

                // Formato antiguo: array directo
                if (Array.isArray(json)) {
                    resolve(json)
                    return
                }

                reject(new Error('El archivo JSON no tiene un formato reconocido'))
            } catch (error) {
                reject(new Error('Error al parsear el archivo JSON'))
            }
        }

        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'))
        }

        reader.readAsText(file)
    })
}

/**
 * Valida datos importados usando un schema de Zod
 * 
 * @param data - Array de datos a validar
 * @param schema - Schema de Zod para validar cada elemento
 * @returns Array de datos validados
 * @throws Error si algún elemento no es válido
 */
export function validateImportData<T>(
    data: any[],
    schema: z.ZodSchema<T>
): T[] {
    const validatedData: T[] = []
    const errors: string[] = []

    data.forEach((item, index) => {
        try {
            const validated = schema.parse(item)
            validatedData.push(validated)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.issues.map((issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
                errors.push(`Elemento ${index + 1}: ${errorMessages}`)
            } else {
                errors.push(`Elemento ${index + 1}: Error desconocido`)
            }
        }
    })

    if (errors.length > 0) {
        throw new Error(`Errores de validación:\n${errors.join('\n')}`)
    }

    return validatedData
}

/**
 * Obtiene la fecha actual formateada como DD-MM-YYYY
 * 
 * @returns String con la fecha formateada
 */
export function getFormattedDate(): string {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()

    return `${day}-${month}-${year}`
}
