/**
 * @fileoverview Pruebas unitarias para las utilidades de importar/exportar
 */

import { exportToJSON, importFromJSON, validateImportData } from '../import-export.utils'
import { z } from 'zod'

describe('import-export.utils', () => {
    describe('exportToJSON', () => {
        it('genera un archivo JSON correctamente', () => {
            // Mock de elementos del DOM
            const mockLink = document.createElement('a')
            const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink)
            const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation()
            const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation()
            const clickSpy = jest.spyOn(mockLink, 'click').mockImplementation()

            const data = [{ id: 1, name: 'Test' }]
            exportToJSON(data, 'test-file')

            expect(createElementSpy).toHaveBeenCalledWith('a')
            expect(mockLink.download).toBe('test-file.json')
            expect(clickSpy).toHaveBeenCalled()
            expect(appendChildSpy).toHaveBeenCalled()
            expect(removeChildSpy).toHaveBeenCalled()

            // Cleanup
            createElementSpy.mockRestore()
            appendChildSpy.mockRestore()
            removeChildSpy.mockRestore()
        })
    })

    describe('importFromJSON', () => {
        it('lee un archivo JSON correctamente', async () => {
            const jsonData = [{ id: 1, name: 'Test' }]
            const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
            const file = new File([blob], 'test.json', { type: 'application/json' })

            const result = await importFromJSON(file)

            expect(result).toEqual(jsonData)
        })

        it('rechaza archivos que no son JSON', async () => {
            const file = new File(['test'], 'test.txt', { type: 'text/plain' })

            await expect(importFromJSON(file)).rejects.toThrow('El archivo debe ser un JSON válido')
        })

        it('rechaza JSON que no es un array', async () => {
            const jsonData = { id: 1, name: 'Test' }
            const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' })
            const file = new File([blob], 'test.json', { type: 'application/json' })

            await expect(importFromJSON(file)).rejects.toThrow('El archivo JSON debe contener un array de datos')
        })
    })

    describe('validateImportData', () => {
        const testSchema = z.object({
            id: z.number(),
            name: z.string()
        })

        it('valida datos correctamente con Zod', () => {
            const data = [
                { id: 1, name: 'Test 1' },
                { id: 2, name: 'Test 2' }
            ]

            const result = validateImportData(data, testSchema)

            expect(result).toEqual(data)
        })

        it('lanza error para datos inválidos', () => {
            const data = [
                { id: 1, name: 'Test 1' },
                { id: 'invalid', name: 'Test 2' } // id debe ser número
            ]

            expect(() => validateImportData(data, testSchema)).toThrow('Errores de validación')
        })

        it('valida un array vacío sin errores', () => {
            const result = validateImportData([], testSchema)
            expect(result).toEqual([])
        })
    })
})
