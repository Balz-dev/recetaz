/**
 * @fileoverview Pruebas unitarias para el componente CatalogFilters
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { CatalogFilters } from '../CatalogFilters'

describe('CatalogFilters', () => {
    const mockOnSearchChange = jest.fn()

    beforeEach(() => {
        mockOnSearchChange.mockClear()
    })

    it('muestra el placeholder correcto', () => {
        render(
            <CatalogFilters
                searchValue=""
                onSearchChange={mockOnSearchChange}
                searchPlaceholder="Buscar elementos..."
            />
        )

        const input = screen.getByPlaceholderText('Buscar elementos...')
        expect(input).toBeInTheDocument()
    })

    it('ejecuta el callback al cambiar la búsqueda', () => {
        render(
            <CatalogFilters
                searchValue=""
                onSearchChange={mockOnSearchChange}
                searchPlaceholder="Buscar..."
            />
        )

        const input = screen.getByPlaceholderText('Buscar...')
        fireEvent.change(input, { target: { value: 'test' } })

        expect(mockOnSearchChange).toHaveBeenCalledWith('test')
    })

    it('muestra el valor de búsqueda actual', () => {
        render(
            <CatalogFilters
                searchValue="current value"
                onSearchChange={mockOnSearchChange}
                searchPlaceholder="Buscar..."
            />
        )

        const input = screen.getByPlaceholderText('Buscar...') as HTMLInputElement
        expect(input.value).toBe('current value')
    })

    it('renderiza filtros personalizados', () => {
        render(
            <CatalogFilters
                searchValue=""
                onSearchChange={mockOnSearchChange}
                searchPlaceholder="Buscar..."
            >
                <div data-testid="custom-filter">Custom Filter</div>
            </CatalogFilters>
        )

        expect(screen.getByTestId('custom-filter')).toBeInTheDocument()
        expect(screen.getByText('Custom Filter')).toBeInTheDocument()
    })

    it('renderiza el título "Filtros"', () => {
        render(
            <CatalogFilters
                searchValue=""
                onSearchChange={mockOnSearchChange}
                searchPlaceholder="Buscar..."
            />
        )

        expect(screen.getByText('Filtros')).toBeInTheDocument()
    })
})
