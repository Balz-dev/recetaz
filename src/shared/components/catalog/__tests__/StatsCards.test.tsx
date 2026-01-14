/**
 * @fileoverview Pruebas unitarias para el componente StatsCards
 */

import { render, screen } from '@testing-library/react'
import { StatsCards } from '../StatsCards'
import { Package } from 'lucide-react'

describe('StatsCards', () => {
    it('renderiza todas las tarjetas de estadísticas', () => {
        const stats = [
            { title: 'Total', value: 100, icon: Package },
            { title: 'Activos', value: 50 },
            { title: 'Inactivos', value: 50 }
        ]

        render(<StatsCards stats={stats} />)

        expect(screen.getByText('Total')).toBeInTheDocument()
        expect(screen.getByText('Activos')).toBeInTheDocument()
        expect(screen.getByText('Inactivos')).toBeInTheDocument()
    })

    it('muestra los valores correctos', () => {
        const stats = [
            { title: 'Total', value: 100 },
            { title: 'Activos', value: 75 }
        ]

        render(<StatsCards stats={stats} />)

        expect(screen.getByText('100')).toBeInTheDocument()
        expect(screen.getByText('75')).toBeInTheDocument()
    })

    it('renderiza correctamente sin iconos', () => {
        const stats = [
            { title: 'Test 1', value: 10 },
            { title: 'Test 2', value: 20 }
        ]

        render(<StatsCards stats={stats} />)

        expect(screen.getByText('Test 1')).toBeInTheDocument()
        expect(screen.getByText('Test 2')).toBeInTheDocument()
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('20')).toBeInTheDocument()
    })

    it('renderiza un array vacío sin errores', () => {
        const { container } = render(<StatsCards stats={[]} />)
        expect(container.querySelector('.grid')).toBeInTheDocument()
    })
})
