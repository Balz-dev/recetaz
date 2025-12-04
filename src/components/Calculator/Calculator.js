/**
 * Tutorial: Composición
 * ---------------------
 * Este es nuestro componente contenedor "Inteligente".
 * Conecta la Lógica (hook useCalculator) con la UI (Display, Keypad).
 * 
 * 1. Importa el hook.
 * 2. Obtiene el estado y las acciones.
 * 3. Los pasa a los hijos.
 */
'use client'; // Requerido porque usamos hooks (useReducer)

import { useCalculator } from '@/hooks/useCalculator';
import Display from './Display';
import Keypad from './Keypad';
import styles from './Calculator.module.css';

export default function Calculator() {
    const { state, actions } = useCalculator();

    return (
        <div className={styles.calculatorCard}>
            <Display
                value={state.currentValue}
                previousValue={state.previousValue}
                operator={state.operator}
            />

            <Keypad
                onDigit={actions.inputDigit}
                onDot={actions.inputDot}
                onOperator={actions.setOperator}
                onCalculate={actions.calculateResult}
                onClear={actions.clear}
                onDelete={actions.deleteLast}
            />
        </div>
    );
}
