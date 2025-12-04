import { useReducer } from 'react';

/**
 * Tutorial: ¿Por qué useReducer?
 * ------------------------------
 * Para estados simples (como un interruptor), `useState` es genial.
 * Pero una calculadora tiene transiciones de estado complejas:
 * - Escribir un número depende de si acabamos de presionar un operador.
 * - Presionar '=' depende del operador anterior y el valor actual.
 * 
 * `useReducer` nos permite centralizar esta lógica en una sola función (el reducer),
 * haciendo que sea más fácil de probar y razonar que tener llamadas `setState` dispersas.
 */

// 1. Definir el estado inicial de nuestra calculadora
const initialState = {
    currentValue: '0',  // Lo que se muestra en pantalla
    previousValue: null, // El valor almacenado antes de una operación
    operator: null,      // El operador activo (+, -, *, /)
    waitingForNewValue: false // Verdadero después de presionar un operador, para que la siguiente tecla limpie la pantalla
};

// 2. Definir tipos de acciones (buena práctica para evitar errores tipográficos)
const ACTIONS = {
    INPUT_DIGIT: 'INPUT_DIGIT',
    INPUT_DOT: 'INPUT_DOT',
    SET_OPERATOR: 'SET_OPERATOR',
    CALCULATE: 'CALCULATE',
    CLEAR: 'CLEAR',
    DELETE: 'DELETE'
};

// 3. La Función Reducer: (estado, acción) => nuevoEstado
function calculatorReducer(state, action) {
    switch (action.type) {

        case ACTIONS.INPUT_DIGIT:
            // Si estamos esperando un nuevo valor (ej. después de presionar +), reemplazamos el valor actual
            if (state.waitingForNewValue) {
                return {
                    ...state,
                    currentValue: action.payload,
                    waitingForNewValue: false
                };
            }
            // De lo contrario, añadimos el dígito (evitar múltiples ceros a la izquierda)
            if (state.currentValue === '0' && action.payload === '0') return state;
            if (state.currentValue === '0' && action.payload !== '0') {
                return { ...state, currentValue: action.payload };
            }
            return {
                ...state,
                currentValue: state.currentValue + action.payload
            };

        case ACTIONS.INPUT_DOT:
            if (state.waitingForNewValue) {
                return {
                    ...state,
                    currentValue: '0.',
                    waitingForNewValue: false
                };
            }
            // Evitar múltiples decimales
            if (state.currentValue.includes('.')) return state;
            return {
                ...state,
                currentValue: state.currentValue + '.'
            };

        case ACTIONS.SET_OPERATOR:
            // Si ya tenemos un operador y acabamos de escribir un número, calcular el resultado intermedio
            if (state.operator && !state.waitingForNewValue && state.previousValue) {
                const result = calculate(state.previousValue, state.currentValue, state.operator);
                return {
                    ...state,
                    currentValue: String(result),
                    previousValue: String(result),
                    operator: action.payload,
                    waitingForNewValue: true
                };
            }
            // Caso estándar: Almacenar valor actual y esperar el siguiente
            return {
                ...state,
                previousValue: state.currentValue,
                operator: action.payload,
                waitingForNewValue: true
            };

        case ACTIONS.CALCULATE:
            if (!state.operator || !state.previousValue) return state;
            const finalResult = calculate(state.previousValue, state.currentValue, state.operator);
            return {
                ...state,
                currentValue: String(finalResult),
                previousValue: null,
                operator: null,
                waitingForNewValue: true
            };

        case ACTIONS.CLEAR:
            return initialState;

        case ACTIONS.DELETE:
            if (state.waitingForNewValue) return state;
            if (state.currentValue.length === 1) {
                return { ...state, currentValue: '0' };
            }
            return {
                ...state,
                currentValue: state.currentValue.slice(0, -1)
            };

        default:
            return state;
    }
}

// Función auxiliar para las matemáticas
function calculate(a, b, op) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return 0;

    switch (op) {
        case '+': return numA + numB;
        case '-': return numA - numB;
        case '×': return numA * numB;
        case '÷': return numB === 0 ? 'Error' : numA / numB;
        default: return numB;
    }
}

// 4. El Hook Personalizado
export function useCalculator() {
    const [state, dispatch] = useReducer(calculatorReducer, initialState);

    // Exponer funciones simples a los componentes de UI
    const inputDigit = (digit) => dispatch({ type: ACTIONS.INPUT_DIGIT, payload: digit });
    const inputDot = () => dispatch({ type: ACTIONS.INPUT_DOT });
    const setOperator = (operator) => dispatch({ type: ACTIONS.SET_OPERATOR, payload: operator });
    const calculateResult = () => dispatch({ type: ACTIONS.CALCULATE });
    const clear = () => dispatch({ type: ACTIONS.CLEAR });
    const deleteLast = () => dispatch({ type: ACTIONS.DELETE });

    return {
        state,
        actions: { inputDigit, inputDot, setOperator, calculateResult, clear, deleteLast }
    };
}
