/**
 * @fileoverview Pruebas unitarias para el componente TableActions
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { TableActions } from '../TableActions'

describe('TableActions', () => {
    const mockOnEdit = jest.fn()
    const mockOnDelete = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renderiza los botones de editar y eliminar', () => {
        render(<TableActions onEdit={mockOnEdit} onDelete={mockOnDelete} />)

        expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument()
    })

    it('llama a onEdit cuando se hace clic en editar', () => {
        render(<TableActions onEdit={mockOnEdit} onDelete={mockOnDelete} />)

        fireEvent.click(screen.getByRole('button', { name: /editar/i }))
        expect(mockOnEdit).toHaveBeenCalledTimes(1)
    })

    it('llama a onDelete cuando se hace clic en eliminar', () => {
        render(<TableActions onEdit={mockOnEdit} onDelete={mockOnDelete} />)

        fireEvent.click(screen.getByRole('button', { name: /eliminar/i }))
        expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })

    it('usa los labels personalizados si se proporcionan', () => {
        render(
            <TableActions
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                editLabel="Custom Edit"
                deleteLabel="Custom Delete"
            />
        )

        expect(screen.getByRole('button', { name: 'Custom Edit' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Custom Delete' })).toBeInTheDocument()
    })
})
