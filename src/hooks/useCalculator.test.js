import { renderHook, act } from '@testing-library/react';
import { useCalculator } from './useCalculator';

describe('useCalculator Hook', () => {
    test('debe tener el estado inicial correcto', () => {
        const { result } = renderHook(() => useCalculator());

        expect(result.current.state.currentValue).toBe('0');
        expect(result.current.state.previousValue).toBe(null);
        expect(result.current.state.operator).toBe(null);
    });

    test('debe actualizar el valor actual al escribir dígitos', () => {
        const { result } = renderHook(() => useCalculator());

        act(() => {
            result.current.actions.inputDigit('1');
            result.current.actions.inputDigit('2');
        });

        expect(result.current.state.currentValue).toBe('12');
    });

    test('debe realizar una suma correctamente', () => {
        const { result } = renderHook(() => useCalculator());

        act(() => {
            result.current.actions.inputDigit('5');
            result.current.actions.setOperator('+');
            result.current.actions.inputDigit('3');
            result.current.actions.calculateResult();
        });

        expect(result.current.state.currentValue).toBe('8');
    });

    test('debe limpiar la pantalla', () => {
        const { result } = renderHook(() => useCalculator());

        act(() => {
            result.current.actions.inputDigit('5');
            result.current.actions.clear();
        });

        expect(result.current.state.currentValue).toBe('0');
    });
});
