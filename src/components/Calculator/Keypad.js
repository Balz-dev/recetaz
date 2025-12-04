/**
 * Tutorial: Manejo de Eventos
 * ---------------------------
 * El componente Keypad renderiza todos nuestros botones.
 * Nota cómo pasamos funciones (como `onDigit`, `onOperator`) como props.
 * Cuando un usuario hace clic en un botón, llamamos a estas funciones del padre.
 * Esto se llama "elevar el estado" (lifting state up): el hijo notifica al padre de los eventos.
 */
import styles from './Calculator.module.css';

export default function Keypad({ onDigit, onOperator, onCalculate, onClear, onDelete, onDot }) {

    // Ayudante para renderizar un botón estándar
    const renderBtn = (label, onClick, type = 'digit') => (
        <button
            className={`${styles.button} ${styles[type]}`}
            onClick={() => onClick(label)}
        >
            {label}
        </button>
    );

    return (
        <div className={styles.keypad}>
            {/* Fila 1 */}
            {renderBtn('C', onClear, 'function')}
            {renderBtn('DEL', onDelete, 'function')}
            {renderBtn('%', () => onOperator('%'), 'function')} {/* Módulo como ejemplo */}
            {renderBtn('÷', () => onOperator('÷'), 'operator')}

            {/* Fila 2 */}
            {renderBtn('7', onDigit)}
            {renderBtn('8', onDigit)}
            {renderBtn('9', onDigit)}
            {renderBtn('×', () => onOperator('×'), 'operator')}

            {/* Fila 3 */}
            {renderBtn('4', onDigit)}
            {renderBtn('5', onDigit)}
            {renderBtn('6', onDigit)}
            {renderBtn('-', () => onOperator('-'), 'operator')}

            {/* Fila 4 */}
            {renderBtn('1', onDigit)}
            {renderBtn('2', onDigit)}
            {renderBtn('3', onDigit)}
            {renderBtn('+', () => onOperator('+'), 'operator')}

            {/* Fila 5 */}
            {renderBtn('0', onDigit, 'zero')}
            {renderBtn('.', onDot)}
            {renderBtn('=', onCalculate, 'equals')}
        </div>
    );
}
