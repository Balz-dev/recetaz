/**
 * @fileoverview Componente de botones de importar/exportar datos
 * 
 * Proporciona botones para importar y exportar datos en formato JSON
 */

'use client'

import { Button } from '@/shared/components/ui/button'
import { useToast } from '@/shared/components/ui/use-toast'
import { Download, Upload } from 'lucide-react'
import { useRef } from 'react'

/**
 * Props del componente ImportExportButtons
 */
interface ImportExportButtonsProps {
    /** Callback para exportar datos */
    onExport: () => Promise<void>
    /** Callback para importar datos */
    onImport: (data: any[]) => Promise<void>
    /** Nombre de la entidad (para mensajes) */
    entityName: string
}

/**
 * Componente de botones para importar/exportar datos
 * 
 * @param props - Propiedades del componente
 * @returns Grupo de botones para importar y exportar
 */
export function ImportExportButtons({
    onExport,
    onImport,
    entityName
}: ImportExportButtonsProps) {
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    /**
     * Maneja el clic en el botón de exportar
     */
    const handleExport = async () => {
        try {
            await onExport()
            toast({
                title: 'Exportación exitosa',
                description: `Los datos de ${entityName} se han exportado correctamente.`
            })
        } catch (error) {
            toast({
                title: 'Error al exportar',
                description: error instanceof Error ? error.message : 'No se pudieron exportar los datos',
                variant: 'destructive'
            })
        }
    }

    /**
     * Maneja el clic en el botón de importar
     */
    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    /**
     * Maneja la selección de archivo para importar
     */
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const text = await file.text()
            const data = JSON.parse(text)

            if (!Array.isArray(data)) {
                throw new Error('El archivo JSON debe contener un array de datos')
            }

            await onImport(data)

            toast({
                title: 'Importación exitosa',
                description: `Se importaron ${data.length} registros de ${entityName}.`
            })
        } catch (error) {
            toast({
                title: 'Error al importar',
                description: error instanceof Error ? error.message : 'No se pudieron importar los datos',
                variant: 'destructive'
            })
        } finally {
            // Limpiar el input para permitir importar el mismo archivo nuevamente
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={handleImportClick}>
                <Upload className="h-4 w-4 mr-2" />
                Importar
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    )
}
