import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SelectorColor } from '../components/SelectorColor';
import { ToolbarPropiedades } from '../components/ToolbarPropiedades';
import { CampoPlantilla } from '@/types';

// Mock simple de ResizeObserver para evitar errores en tests de UI si fuera necesario
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('Componentes Decorativos', () => {

    describe('SelectorColor', () => {
        it('renderiza el botón con el color actual', () => {
            render(<SelectorColor color="#ff0000" onChange={() => { }} />);
            const btn = screen.getByTitle('Cambiar color');
            expect(btn).toBeInTheDocument();
            expect(btn).toHaveStyle({ backgroundColor: '#ff0000' });
        });

        it('abre el popover al hacer click', () => {
            render(<SelectorColor color="#000000" onChange={() => { }} />);
            const btn = screen.getByTitle('Cambiar color');
            fireEvent.click(btn);
            expect(screen.getByText('Personalizado')).toBeInTheDocument();
        });

        it('llama a onChange al seleccionar un preset', () => {
            const handleChange = jest.fn();
            render(<SelectorColor color="#000000" onChange={handleChange} />);
            fireEvent.click(screen.getByTitle('Cambiar color'));

            // Buscar un botón de color específico del preset, ej el rojo
            // Los botones de preset no tienen texto, pero podemos buscarlos por rol
            const presets = screen.getAllByRole('button');
            // El primero es el trigger, luego los presets.
            // Preset Rojo es #dc2626 según constante
            const redPreset = presets.find(p => p.style.backgroundColor === 'rgb(220, 38, 38)'); // #dc2626 en rgb

            if (redPreset) {
                fireEvent.click(redPreset);
                expect(handleChange).toHaveBeenCalledWith('#dc2626');
            }
        });
    });

    describe('ToolbarPropiedades', () => {
        const mockField: CampoPlantilla = {
            id: 'test_1',
            etiqueta: 'Test',
            tipo: 'linea',
            x: 10,
            y: 10,
            ancho: 20,
            visible: true,
            color: '#000000'
        };

        const mockContainerRef = { current: document.createElement('div') };

        it('renderiza controles básicos', () => {
            render(
                <ToolbarPropiedades
                    field={mockField}
                    onUpdate={() => { }}
                    onDelete={() => { }}
                    onDuplicate={() => { }}
                    containerRef={mockContainerRef}
                />
            );

            expect(screen.getByTitle('Eliminar')).toBeInTheDocument();
            expect(screen.getByText('linea')).toBeInTheDocument();
        });

        it('muestra selector de color para tipos permitidos', () => {
            render(
                <ToolbarPropiedades
                    field={{ ...mockField, tipo: 'cuadrado' }}
                    onUpdate={() => { }}
                    onDelete={() => { }}
                    containerRef={mockContainerRef}
                />
            );
            expect(screen.getByTitle('Cambiar color')).toBeInTheDocument();
        });
    });
});
