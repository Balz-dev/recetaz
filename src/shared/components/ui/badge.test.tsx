/**
 * @fileoverview Pruebas unitarias para el componente Badge
 */

import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge', () => {
    it('renderiza el contenido correctamente', () => {
        render(<Badge>Test Badge</Badge>)
        expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('aplica la variante por defecto', () => {
        const { container } = render(<Badge>Default</Badge>)
        expect(container.firstChild).toHaveClass('bg-primary')
    })

    it('aplica variantes personalizadas', () => {
        const { container } = render(<Badge variant="destructive">Destructive</Badge>)
        expect(container.firstChild).toHaveClass('bg-destructive')
    })

    it('aplica clases adicionales vía className', () => {
        const { container } = render(<Badge className="custom-class">Custom</Badge>)
        expect(container.firstChild).toHaveClass('custom-class')
    })
})
