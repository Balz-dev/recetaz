/**
 * @fileoverview Pruebas unitarias para el componente CatalogHeader
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { CatalogHeader } from '../CatalogHeader'
import { Plus } from 'lucide-react'

describe('CatalogHeader', () => {
    const mockOnButtonClick = jest.fn()

    beforeEach(() => {
        mockOnButtonClick.mockClear()
    })

    it('renderiza correctamente el título y descripción', () => {
        render(
            <CatalogHeader
                title="Test Title"
                description="Test Description"
                buttonText="Test Button"
                onButtonClick={mockOnButtonClick}
            />
        )

        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('muestra el texto correcto del botón', () => {
        render(
            <CatalogHeader
                title="Test Title"
                description="Test Description"
                buttonText="Nuevo Elemento"
                onButtonClick={mockOnButtonClick}
            />
        )

        expect(screen.getByText('Nuevo Elemento')).toBeInTheDocument()
    })

    it('ejecuta el callback al hacer clic en el botón', () => {
        render(
            <CatalogHeader
                title="Test Title"
                description="Test Description"
                buttonText="Test Button"
                onButtonClick={mockOnButtonClick}
            />
        )

        const button = screen.getByRole('button', { name: /Test Button/i })
        fireEvent.click(button)

        expect(mockOnButtonClick).toHaveBeenCalledTimes(1)
    })

    it('renderiza el icono del botón cuando se proporciona', () => {
        render(
            <CatalogHeader
                title="Test Title"
                description="Test Description"
                buttonText="Test Button"
                onButtonClick={mockOnButtonClick}
                ButtonIcon={Plus}
            />
        )

        const button = screen.getByRole('button', { name: /Test Button/i })
        expect(button).toBeInTheDocument()
    })
})
