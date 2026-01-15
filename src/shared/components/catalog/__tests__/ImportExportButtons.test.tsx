/**
 * @fileoverview Pruebas unitarias para el componente ImportExportButtons
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImportExportButtons } from '../ImportExportButtons'

// Mock del hook useToast
jest.mock('@/shared/components/ui/use-toast', () => ({
    useToast: () => ({
        toast: jest.fn()
    })
}))

describe('ImportExportButtons', () => {
    const mockOnExport = jest.fn()
    const mockOnImport = jest.fn()

    beforeEach(() => {
        mockOnExport.mockClear()
        mockOnImport.mockClear()
    })

    it('renderiza los botones de exportar e importar', () => {
        render(
            <ImportExportButtons
                onExport={mockOnExport}
                onImport={mockOnImport}
                entityName="test"
            />
        )

        expect(screen.getByText('Exportar')).toBeInTheDocument()
        expect(screen.getByText('Importar')).toBeInTheDocument()
    })

    it('ejecuta el callback de exportar al hacer clic', async () => {
        mockOnExport.mockResolvedValue(undefined)

        render(
            <ImportExportButtons
                onExport={mockOnExport}
                onImport={mockOnImport}
                entityName="test"
            />
        )

        const exportButton = screen.getByText('Exportar')
        fireEvent.click(exportButton)

        await waitFor(() => {
            expect(mockOnExport).toHaveBeenCalledTimes(1)
        })
    })

    it('abre el selector de archivos al hacer clic en importar', () => {
        render(
            <ImportExportButtons
                onExport={mockOnExport}
                onImport={mockOnImport}
                entityName="test"
            />
        )

        const importButton = screen.getByText('Importar')
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

        expect(fileInput).toBeInTheDocument()
        expect(fileInput.accept).toBe('.json')
    })
})
